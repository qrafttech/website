---
title: "Detecting fields in satellite imagery with Hugging Face"
slug: detecting-fields-in-satellite-imagery-with-hugging-face
date: 2026-11-17
author: "Adrien"
tmba: true
video: "https://media.qraft.tech/tmba/detecter-des-champs-sur-une-image-satellite-avec-hugging-face-v2-en.mp4"
excerpt: "A 62-million-parameter model, fifteen GPU jobs in parallel on Hugging Face, $2.13 for 1,500 km² of maps. And a tour of the Hub along the way."
---

For a client, Adrien had to draw the outlines of cultivated fields on a satellite basemap, then find the irrigated ones. He had hardly ever used Hugging Face. The talk tells how he got there, and what he found along the way.

## What already existed, and why it was not enough

First lead: a ready-made database, Fields of The World, which lists billions of fields across the planet. The integration was ideal: the browser sends coordinates, the server returns tiles with the field shapes and a confidence score.

But it comes from a model trained on Sentinel-2 images at 10-meter resolution, mostly in Europe. On the humid West African countries we cared about, it falls apart: at a 69% confidence threshold the whole forest becomes a field, and raise it and almost nothing is left.

The model behind that database is excellent in benchmarks, provided you give it 3-meter images, the infrared layer and two dates (growing, then harvested). Three obstacles: those images cost tens of thousands of dollars for a proof of concept alone, the volume explodes at the scale of a continent, and its license forbids commercial use.

> [!TIP]
> When someone has already published the solution, it is worth digging into how it was built. Here the database was good where the model had data, and only there.

## Delineate Anything

The model he kept is a YOLO (*You Only Look Once*), a family of models that detect shapes in an image, around since 2015. This one was retrained on 73 million fields in 61 countries, with a dataset also published on Hugging Face. It needs a single image, and returns GeoJSON outlines ready to draw on the map.

The choice was to give it the best image possible: the Esri basemap, at 1-meter resolution. Results are clearly better, without being perfect: it still misses fields, and nobody quite knows why. Accuracy was not the goal: the AI does 80% of the work, and people correct the rest.

The model comes with its authors' script: it cuts an image of any size (here 11,400 × 7,900 pixels) into 512-pixel tiles, handles the overlap, runs each tile through the model and stitches everything back. Adrien reused it as is.

## Where to run it

The model is small: 125 MB, 62 million parameters, where large proprietary models have hundreds of billions. "It runs on a Mac" is true, but that is no reason to run it on a Mac:

- **On the Mac**: 25 minutes for a small demo area, with the machine maxed out and unusable. The project's five 50 × 50 km areas, 120 images, would have taken about 18 hours.
- **On a server**: a VPS without a GPU costs around twenty euros a month, a server with a graphics card ten times that, paid by the month for a model that runs a few hours.
- **GPU by the hour** at AWS, Google Cloud or RunPod: possible, but more setup.
- **Hugging Face Jobs**, the one he kept: GPU by the minute, and as many machines in parallel as you want.

Each job installs the authors' script and PyTorch on a T4 small machine (a small Nvidia GPU, the best value for money), receives the coordinates of its images and the Esri API key as a secret, downloads the tiles, runs the detection and pushes the result to a Hugging Face dataset, which served as the database during the proof of concept.

The 120 images, spread over 15 independent jobs, took 320 GPU minutes in total, for **$2.13**.

A known limit: splitting the work in fifteen leaves badly stitched fields at the seams between jobs. In production, one longer job is better: the machine is not ours, so whether it runs two hours or two days makes little difference.

## And the irrigated fields?

The field outlines were only the first step. To tell whether a field is irrigated, you look at twelve months in the dry season, with Google Earth data:

1. rainfall: whether it has not rained for months,
2. the field's greenness (NDVI), compared with the median of the field-free landscape within 2 km,
3. evapotranspiration.

A field that stays greener than its surroundings without rain is probably irrigated. That is why outline detection was central: it is what separates the field from its surroundings. Then come property records where they exist, and an agent that searches the web for the farmers and their contacts where they do not. The prototype took a few days.

## A detour through Sonnet

Adrien also tried the detection with Sonnet. It does better than the specialized model, but costs about $1 per 10 km², against $2 for 1,500 km²: around 75 times more. Hence a product idea: a first pass with the specialized model, and a cleanup with a large model only where someone asks for it.

## The rest of the Hub

- **Models**, filterable by task (text to text, image to mask…) and by size. They rarely come alone: a script, an app or a Docker image, often from the research paper, shows how to run them.
- **Inference Providers**: hosts that run an open model for you and expose it as an API, French hosts included, which matters to clients who ask about sovereignty.
- **Datasets**: to train, to evaluate several models on the same reference set, or simply to store results.
- **Spaces**: small demo apps to try a model before downloading it, by dropping in an image or an audio file. Community-made, so of very uneven quality.

## Questions from the room

- **Open weights or open source?** Open weights is the model alone: the ingredients, not the recipe. Open source also means the data and the training protocol. Either way, a license says what you may do with it.
- **A Chinese model hosted in France, or a French model hosted who knows where?** The question stayed open.
- **Does it need to be 100% accurate?** Not for prospecting: the point is to give leads to a salesperson, not a land registry. Depending on the crop, some fields will never be detected, and that is fine.
