---
title: "I talk to my coding agents with a DJI mic"
slug: i-talk-to-my-coding-agents-with-a-dji-mic
date: 2026-12-24
author: "Nicolas Rouanne"
cover: "cover.jpg"
social: "social.jpg"
excerpt: "I barely type any more: I talk to my coding agents all day. It gives them context, it frees my mind, I think while I talk, and above all it's much faster."
---

I barely type any more. All day long, I talk to my coding agents, with a small wireless mic on my collar, and it changed the way I work with them.

Here is a message I sent on the evening of November 25 to Poulpito, the [meta-agent that runs my other agents](/en/blog/a-meta-agent-to-run-my-coding-agents). It's in French, and it's the raw transcription, mangled words included (more on those below):

> J'ai fini parce que c'était en cours sur Hot Greenfield, est-ce que tu peux supprimer le Word Tricourt et en recrée un pour supprimer tous les commentaires comme j'avais fait dans une paire, tu reprends l'esprit de cette paire pour savoir quel commentaire il faut supprimer ou pas et un deuxième Wrice ça Khadi bien les deux ensemble pour pour mettre tous les schémas d'architecture que je t'ai déjà partagé qui sont notamment dans l'article de blog sur le Red faire un propre mettre le voilà et après on va faire un troisième tri pour déployer tout ça sur quelque part, je sais pas moi, j'imagine Claude Flöhr mais je pas très facile, j'en sais rien ça c'est moins c'est moins prioritaire

Roughly: "I'm done with what was in progress on auth-greenfield. Can you delete the worktree and make a new one to remove all the comments, like I did in a PR, in the spirit of that PR, and a second worktree for all the architecture diagrams I already shared, the ones in the SSO blog post, to make a clean doc. Then a third one to deploy all this somewhere, I don't know, Cloudflare maybe, not sure, that's lower priority."

## I think while I talk

I would never have typed that message. It holds three tasks, their order, a PR to use as a model, the article where the diagrams are, and a doubt about hosting ("I don't know, Cloudflare maybe"). When I speak, I really talk as if I were thinking out loud: I say what I want, why, what I already did elsewhere, what I'm not sure about. That's exactly the context an agent needs.

It also frees my mind. I no longer have to shape what I think before sending it: I talk more naturally, and I think while I talk. I rarely reread what I send, actually. The agent's answer is my proofreading. That evening, Poulpito got all of it:

> C'est lancé dans auth-greenfield :
>
> - **L'ancien worktree est supprimé.** Il était propre et tout était déjà dans main.
> - **Agent 1, les commentaires** : il reprend les règles de ta PR 1 […]
> - **Agent 2, la doc et les schémas** : un README propre et une `architecture.md` à jour. Il remplace les vieux schémas par ceux de l'article SSO […]
>
> **Le déploiement**, peut-être sur Cloudflare, est noté sur la tâche auth-greenfield. On le lance quand les deux PR seront mergées.

"Started in auth-greenfield: the old worktree is deleted, agent 1 handles the comments with the rules of PR 1, agent 2 the docs and the diagrams from the SSO article, and the deployment, maybe on Cloudflare, waits until both PRs are merged." If a line isn't what I meant, I see it right away. And above all, it's much faster than typing.

It fits well with a meta-agent. I only talk to one agent: no tab to pick, I tell Poulpito everything and it splits the work among the others.

One side effect, at the office: my colleagues try to prompt-inject me by shouting into my mic louder than I do. So far, it hasn't worked.

## The mic and the dictation

The mic is a DJI Mic Mini 2. The transmitter goes under my shirt, held by a magnet on the other side of the fabric:

![The DJI transmitter, white and translucent, slipped under the collar of a denim shirt](micro-sous-la-chemise.jpg "The transmitter, under the shirt")

The receiver plugs straight into the MacBook's USB-C port, and the Mac sees it as a microphone:

![The translucent DJI receiver plugged into the USB-C port of a MacBook, on a wooden table](recepteur-usb-c.jpg "The receiver, in the MacBook's USB-C port")

For the dictation, I first tried [Wispr Flow](https://wisprflow.ai). It works really well, tricky words like "PR" or "merge" included, especially when I speak franglais. But it's far too expensive, and I didn't want to pay for yet another tool. So I use [Granola](https://www.granola.ai): its main job is recording my meetings, but it also has a dictation agent that does roughly the same thing. I press a key, it records and transcribes right away, and the text lands in the chat in Orca, the app my agents run in.

## When it misses

The transcription mostly mangles proper nouns. In the message above, "Hot Greenfield" is auth-greenfield, the repo of our SSO exploration, "Word Tricourt" a worktree, "une paire" a PR, and "Claude Flöhr" Cloudflare. The next day I got "Épistole" for Episto, one of our clients, and "Canard Racing" (duck racing) for Jacanda Racing, my sailing project. Poulpito guessed right every time, because it knows my projects and the rest of the sentence helps. And with a clean recording, almost everything gets through: my last long dictation came in without a single error. It works really well even with noise around, thanks to the mic's active noise cancellation, but the better it hears me, the better it works.

The only real miss comes precisely from the way I think out loud: thinking out loud sounds a lot like an instruction. One morning, I had told it "let's talk about it first" about a small internal page, then answered "GitHub Actions and Cloudflare" to its question about hosting. Twelve seconds later, the repo existed on GitHub, under a name I hadn't chosen yet. Since then, there's a rule in its memory: when I think out loud, it answers, and waits for my go before creating anything.
