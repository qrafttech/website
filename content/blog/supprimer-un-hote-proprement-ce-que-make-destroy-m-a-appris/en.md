---
title: "Deleting a host properly: what make destroy taught me"
slug: deleting-a-host-properly-what-make-destroy-taught-me
date: 2026-11-09
author: "Nicolas Rouanne"
cover: "make-destroy.png"
---

[Last week's article](/en/blog/moving-my-coding-agents-to-an-ovh-vps-with-a-single-boot-script) ended with my coding agents' host on an OVH VPS, and the GCP version "still working, from the same code". That part was only checked with `terraform validate`. So I went to prove it on the real GCP host, which was still on Flatcar, and it didn't go as planned.

## A disk that doesn't change OS

The plan was the one the README describes for an OS change: `make rebuild`, a new Debian VM, and the same data disk, which holds the checkouts, the Tailscale identity and Docker's data root. The VM booted, the first-boot script ran to the end, the env file rendered from 1Password. Then the stack failed to start:

```
error creating overlay mount to /var/lib/orca/docker/overlay2/97afca83…/merged: invalid argument
```

The containers Flatcar's Docker had left on the disk don't start under Debian's Docker. I could have written a migration (empty `/var/lib/orca/docker`, keep the rest), but it would have served one host, once, and the repository would have carried Flatcar's name forever. Since I didn't need that host's data, I chose to start from scratch: create a new GCP host with the README alone, and delete the old one.

Except nothing deleted a host. The data disk is `prevent_destroy`, on purpose, so that no plan ever deletes it by accident. Hence `make destroy`.

## make destroy

```makefile
destroy:
	@[ -n "$(NAME)" ] || { echo "no name in $(TFVARS)"; exit 1; }
	@[ -n "$(PROJECT)" ] || { echo "no project in $(TFVARS)"; exit 1; }
	@read -p "type $(NAME) to delete it ($(PROJECT), $(ZONE)), its data disk, its snapshots and its state: " n; [ "$$n" = "$(NAME)" ]
	$(TF) init -reconfigure -backend-config=bucket=$(BUCKET) -backend-config=prefix=orca-host/$(NAME) >/dev/null
	if $(TF) state list | grep -qx google_compute_region_disk.data; then \
	  $(TF) state rm google_compute_region_disk.data; fi
	$(TF) destroy $(TF_VARS) -auto-approve
	d=$$(gcloud compute disks list --project $(PROJECT) --format='value(name)' \
	  --filter='name=$(NAME)-data AND region~/$(REGION)$$') && \
	{ [ -z "$$d" ] || gcloud compute disks delete $(NAME)-data --region $(REGION) --project $(PROJECT) --quiet; }
	# then the same for the snapshots, and the host's state in the bucket
```

It asks once, for the host's name. Then it takes the disk out of the state, so `prevent_destroy` stays in place for every other plan, lets Terraform delete the rest, and deletes the disk, its snapshots and the state with `gcloud`. Each step skips what's already gone, so a run stopped halfway is just run again.

What's interesting is everything this version doesn't do any more: each of those lines came from a real run that went wrong.

## Four bugs a real run found

**A comma.** Before that, `make secret` failed on the very first try with `unexpected EOF while looking for matching '"'`. An error message inside a `$(if …)` said `make init, make apply`, and in Make a comma separates the arguments of `$(if)`: the recipe was cut in half. It had been broken since the OVH work, on both providers, and nobody had run it since.

**An error read as "already gone".** On the first `make destroy`, Terraform deleted its seven resources, then the disk survived. The check was `gcloud compute disks describe … >/dev/null 2>&1`: gcloud wanted a reauthentication, failed with its prompt hidden, and the `if` read that as "the disk doesn't exist". The fix: a `list` with a filter, with `&&` before the delete. If gcloud fails, the step fails; only an empty result means gone.

**An empty name.** In a new shell, without `TFVARS` exported, the name read from the file is empty, and pressing Enter at the prompt matched it. Now it stops before asking.

**The last `make init`'s state.** Terraform remembers which state it last initialized against. If that was another host, `make destroy` would have deleted that host's resources. It now reinitializes against the right state before anything else, and so do `plan`, `apply` and `rebuild`, which had the same flaw without anyone having noticed.

> [!NOTE]
> A command that deletes needs proof that something is absent, not an error read as an absence. Each of these four bugs is a case where an empty value or a failure passed for "nothing to do".

The fifth came the same day, when deleting an old test state: `make destroy NAME=orca-test` without `TFVARS`, so the name came from the command line, and the bucket was called `-tfstate`. `destroy` now needs the tfvars file like every other target.

The new GCP host was then brought up with the README alone, and the old one deleted. Debian works on GCP; it took actually running it to know.

## Derived images that fall behind

Each person runs their own image, built `FROM` the base image, with their tools: MCP servers, `gcloud`, Playwright. The README said: turn on Dependabot to follow the base. Two of those images were three and four weeks behind. One had even just added buildx itself, which the base had already shipped for a week.

Dependabot did open the bump pull request, but nobody merged it, and it never gets refreshed: both digests carry the same tag, `main`, so to Dependabot a newer base isn't a new version. The pull request sits there, outdated, and the image stays on its old base.

The fix is a workflow, copied into each derived image's repository, that merges that bump on its own once CI has built and checked the image:

```yaml
on:
  workflow_run:
    workflows: [image]
    types: [completed]

jobs:
  merge:
    if: >-
      github.event.workflow_run.conclusion == 'success' &&
      github.event.workflow_run.actor.login == 'dependabot[bot]' &&
      startsWith(github.event.workflow_run.head_branch, 'dependabot/docker/qrafttech/orca-host-')
    runs-on: ubuntu-latest
    steps:
      - run: gh pr merge "${{ github.event.workflow_run.head_branch }}" --merge --match-head-commit "${{ github.event.workflow_run.head_sha }}"
      - run: gh workflow run image.yml --ref main
```

`--match-head-commit` merges the commit CI tested, and no other. The second line is there because a merge made with the workflow's own token triggers no push workflow: `main` wouldn't be rebuilt, and the hosts wouldn't redeploy. Nothing else Dependabot opens is merged automatically.

## And a README for people

The last part is the least technical: walking through the install for real showed that each step needed explaining. The README is now written in sentences, Google Cloud and OVH side by side in a table with their prices, a worked example for adding your own tools, and a table of the errors a first install runs into, the reauthentication one included.

Everything is in [qrafttech/orca-host](https://github.com/qrafttech/orca-host). On OVH, `make destroy` still says to cancel the VPS in OVH's control panel: Terraform never cancels one.
