---
title: "Drawing every field on a map with an AI model"
slug: drawing-every-field-on-a-map-with-an-ai-model
date: 2026-11-30
author: "Adrien Lupo"
cover: "cover.jpg"
excerpt: "The existing field boundary databases were too imprecise, so we ran Delineate Anything on Hugging Face Jobs: 120 images for $2.13."
---

For the [prospecting map we built for a client](/en/blog/a-map-to-help-sales-reps-find-irrigated-fields) that sells irrigation equipment, we had to draw every farm field across five 50 × 50 km areas in Senegal and Côte d'Ivoire. This article covers the AI part: how we chose the model, how we ran it on Hugging Face for **$2.13**, then a tour of the platform.

## 1. Three options for drawing the fields

Field boundary databases already exist, but on our areas they were too imprecise. We looked at three options before picking one.

### Fields of The World, a precomputed database

[Fields of The World](https://fieldsofthe.world/) publishes precomputed field boundaries for the whole planet: about 1.6 billion fields a year, for 2024 and 2025. They are predicted from Sentinel-2 imagery at 10 m, by a team that includes Microsoft AI for Good and Taylor Geospatial. The data is licensed CC-BY-4.0, served as PMTiles vector tiles you can load straight onto a map.

It was the first thing I tried. Around N'Douci in Côte d'Ivoire, with the confidence threshold at 69%, there are **a lot of false positives**: large blobs cover forest and plantations without separating the plots. Raise the threshold and **you lose many real fields**. And the right setting changes from one area to the next.

![The Fields of The World explorer around N'Douci: large coloured blobs cover forest and plantations without separating the plots.](fields-of-the-world-ndouci.jpg "Fields of The World around N'Douci (Côte d'Ivoire), 2025 predictions, confidence threshold at 69%.")

### Fields of the Planet, a model that is costly to run at scale

The same team publishes [Fields of the Planet](https://huggingface.co/fieldsoftheworld/ftp-b7), a model you run yourself: a 270 MB U-Net. It takes two 3 m PlanetScope images of the same area, with near-infrared, one at planting and one at harvest. It then classifies each pixel as background, field interior or boundary.

![Diagram of the Fields of the Planet model: two near-infrared images, at planting and at harvest, go into a 270 MB U-Net that classifies each pixel as background, field interior or boundary.](fields-of-the-planet-en.png "Fields of the Planet: two dates, near-infrared, one class per pixel.")

It falls short on three counts. First, **cost**: it needs the same imagery as in training, which is paid Planet imagery. Then **scale**: planting and harvest dates change with the crop, the country and the region, so covering a country would mean picking them area by area. Finally **the licence**, CC-BY-NC-4.0, which forbids commercial use, and so a client product like this one.

### Delineate Anything, an ordinary photo is enough

[Delineate Anything](https://huggingface.co/MykolaL/DelineateAnything) is **a YOLO11 model retrained to delineate fields**. YOLO, short for *You Only Look Once*, is a family of vision models that finds every object in an image in a single pass, which makes them fast. [YOLO11](https://docs.ultralytics.com/models/yolo11/) is the version Ultralytics released in September 2024. It detects objects and can also trace their exact outline, which is called instance segmentation. Delineate Anything uses its largest variant, YOLO11x-seg, trained to recognise fields instead of cars or pedestrians. **Each detected field becomes a separate object**, with its own outline.

![Diagram of Delineate Anything: a single ordinary satellite photo goes into the model (YOLO, 125 MB), and each field comes out as a separate object with its vector outline.](delineate-anything-en.png "Delineate Anything: one photo, one object per field.")

It needs **an ordinary colour photo, from a single date**, at a resolution between 0.25 and 10 m. We use it on a satellite photo at about 1 m. It was trained on [FBIS-73M](https://huggingface.co/datasets/MykolaL/FBIS-73M) (MIT licence): 1.48 million images and 74 million annotated fields across 61 countries, where the Fields of The World dataset covers 24, 17 of them in Europe.

It is licensed AGPL-3.0, which **allows commercial use**. The obligation applies to modified code served to users over a network, whose source must then be published; we run the authors' pipeline without changing its code, as a batch. And it's small, about 62 million parameters for 125 MB of weights: **it even runs on a laptop**.

## 2. The implementation

### The authors' pipeline

The [Delineate Anything GitHub repository](https://github.com/Lavreniuk/Delineate-Anything) ships a script, `delineate.py`, that processes a large image in four steps. It cuts it into 512 px tiles, overlaps them by half so a field cut at the edge of one tile is seen whole in the next, detects the fields in batches on the GPU, then merges everything into a single vector layer. It outputs a GeoPackage, which I convert to GeoJSON for the map.

![The four steps of the Delineate Anything pipeline: cut into 512 px tiles, overlap by half, detect in batches on the GPU, merge into a single layer.](pipeline-delineate-en.png "The authors' pipeline on an 11,400 × 7,900 px image: about 770 outlines.")

**I don't touch this script's code.** I fetch it at a pinned commit and install it the way the README says. I only change two settings in its configuration: the land cover mask, for which I use [ESA WorldCover](https://esa-worldcover.org/), and the minimum field area.

One image covers about 13 × 9 km, so my five areas need 120 of them, 24 per area.

### Where to run 120 images

I compared five options, from measurements or estimates based on our measurements.

![Five ways to run the model on 120 images: no API serves it, about 18 h on a Mac, 6 to 8 days on a server without a GPU, about $4-5 on an hourly GPU, $2.13 with Hugging Face Jobs.](ou-faire-tourner-en.png "Five options for 120 images.")

No inference provider serves this model through an API on Hugging Face, so that option is out. On my MacBook Pro M1 Pro, the pipeline uses Apple's GPU and runs about half as fast as on a T4: roughly 18 hours of non-stop compute. A VPS without a GPU at €20 a month before VAT would take 6 to 8 days, and a server with a GPU costs around €200 a month. A GPU rented by the hour from AWS, Google Cloud or RunPod would come to $4 or $5, but you have to start the machine, set it up, then shut it down. I picked **Hugging Face Jobs, which rents a GPU by the minute** and starts with a single request.

### Hugging Face Jobs

A [Job](https://huggingface.co/docs/hub/jobs) is a Docker image, a command, a machine type (the *flavor*) and secrets. Hugging Face **starts the container, bills by the minute and stops it at the end**. No subscription needed, a balance of prepaid credits is enough.

![Diagram of the run: from my Mac, 15 Hugging Face Jobs, 10 at once, each installs the pipeline then processes 8 images, loads the model from the Hub and uploads the result to a private dataset. In total, 320 GPU minutes and $2.13.](hugging-face-jobs-en.png "15 Jobs, 8 images each, $2.13 in total.")

I start the Jobs from a script, through Hugging Face's HTTP API; the [`hf` CLI](https://huggingface.co/docs/huggingface_hub/guides/cli) does the same in one command. Each Job stops after 2 hours at most.

The `t4-small` flavor is one 16 GB NVIDIA T4 GPU, 4 vCPU and 15 GB of RAM, for $0.40 an hour. Setting up the pipeline (conda, pip) takes about 3 minutes: grouping 8 images per Job means paying for it once per 8. **My Mac sends no image**, only coordinates and keys. Each Job fetches its photos, runs `delineate.py`, uploads one file per image to a private dataset on the Hub, then deletes its files. If a Job crashes, **only the current image is lost**.

I also set a cap: the script **starts no Job that could take the total past $10**, and it first checks with Hugging Face's API that the flavor's price hasn't changed.

Across the five areas, that came to **120 images, 15 Jobs with 10 in parallel, 320 billed minutes, $2.13 and 92,098 outlines**.

![The same satellite photo near Saint-Louis, without and then with the field outlines drawn by Delineate Anything.](avant-apres.jpg)

To try the model on one image without installing anything, the authors' README points to a [demo on a Hugging Face Space](https://huggingface.co/spaces/hugging-apps/delineate-anything-v2).

## 3. Hugging Face

Hugging Face is the platform where open AI models, datasets and demos are shared. It's where we found Delineate Anything and where we ran it. The figures below are from 17 November 2026.

### 3,244,718 models

The [models page](https://huggingface.co/models) is browsed through filters. The diagram shows five of them, with where Delineate Anything sits in each.

![Five filters of the models page: Tasks, Parameters, Libraries, Apps and Inference Providers, with where Delineate Anything sits in each.](filtres-du-hub-en.png "Five Hub filters, and where Delineate Anything sits.")

Tasks says what the model takes and returns, here `image-segmentation`. Parameters gives its size: in 16 bits a parameter weighs 2 bytes, so 1B is about 2 GB of memory. Libraries names the code that loads the weights, here `ultralytics`, on top of PyTorch. Apps lists software to run it on your own machine, such as Ollama or LM Studio, mostly built for LLMs. Inference Providers lists the hosts that serve it through an API. **None serves Delineate Anything, hence Jobs.**

![Delineate Anything's page on Hugging Face: Image Segmentation task, ultralytics library, AGPL-3.0 licence, and no Inference Provider.](hf-modele.jpg)

Every model on the Hub is *open weight*: its weights can be downloaded. **Its licence sets what you're allowed to do with it**, as we saw with Fields of the Planet. Closed models such as GPT, Claude or Gemini aren't there, though OpenAI publishes open models there, the `gpt-oss` family.

### 1,134,666 datasets

A dataset is **a table of examples**: an input, and often the expected answer. Three of its uses show up in this project. FBIS-73M was used to train Delineate Anything. Fields of The World serves as a benchmark to score field delineation models, and Voxel51 put [a copy on the Hub](https://huggingface.co/datasets/Voxel51/fields-of-the-world). Finally, our results are stored in a private dataset, where each upload from a Job is a commit. You can also use one to fine-tune an existing model with your own examples.

### 1,531,251 Spaces

A Space is **a web app hosted by Hugging Face**, most often a model demo, like the one for Delineate Anything. You build it with Gradio, Docker or static HTML, and a Gradio app also exposes an API. Basic CPU hardware is free, GPUs are rented by the hour ($0.40 for a T4 small), and ZeroGPU lends a shared GPU for the duration of a call, with a daily quota of a few minutes. Creating a Gradio or Docker Space usually requires the PRO plan, at $9 a month. The "Duplicate this Space" button creates a private copy under your account.

![The Delineate Anything v2 demo on a Hugging Face Space: a Sentinel-2 image on the left, the delineated fields on the right.](space-demo.jpg)
