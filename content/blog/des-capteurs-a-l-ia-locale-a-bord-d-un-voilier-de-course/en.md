---
title: "From sensors to local AI, aboard a racing yacht"
slug: from-sensors-to-local-ai-aboard-a-racing-yacht
date: 2026-11-24
author: "Adrien"
tmba: true
video: "https://media.qraft.tech/tmba/des-capteurs-a-l-ia-locale-a-bord-d-un-voilier-de-course-en.mp4"
excerpt: "About forty readings a second, expert Windows software, a watch app written with Claude, and a GPU computer that transcribes the crew with no network."
---

For three years, Adrien has been working on the systems of a racing yacht in the Mediterranean: 11 crew on board, a team of 25 people who take turns, 6 to 8 regattas a year, 50 to 60 days of sailing. The boat rarely goes out, so every outing counts for testing: at sea, nothing behaves the way it does at the dock.

Only one person on board does tech: the navigator. He spends the race on a rugged tablet, following where the boat is going, where the others are, and whether there is enough depth to get through. The starting point of the talk: there are 11 brains on board, why should only one have access to the numbers?

## What is on board

The boat only measures: no autopilot, no rams, the crew does everything. That makes the work much simpler, and leaves room to push the data analysis far.

The sensors are plugged into one cable that runs through the boat, an NMEA 2000 bus:

- at the masthead, wind strength and angle,
- a GPS, a gyroscope, the boat's speed through the water,
- a depth sounder,
- the rudder angle,
- load cells in the rigging, to know how the boat is trimmed.

Nobody reads those raw values. Two navigation computers turn them into what sailing uses: the true wind, the boat's angle to the wind, the speed made good toward the wind. They also hold sensor correction tables and targets, the speed or angle the boat should hold in these conditions. Around them: a 5G router, Wi-Fi for the phones and tablets, a Raspberry Pi for development, and a small PC that runs the Windows software, shown over remote desktop on the tablet.

NMEA 2000 dates from the 2000s and sends one value per second. The team would like 10 to 20 times more. One of the computers listens to the bus and republishes the data on the IP network, over WebSocket.

And all of it has to work on a boat doing more than 20 knots, wet, slamming. Below deck there is no cabin, not a cushion. The navigator stays outside: he has to see the race course and talk to the crew.

## Valuable software, on Windows

The 2024 setup, still in use last year, was an old Windows program with tiny buttons: with water on the tablet, it clicks everywhere. The navigator had taped notes around the screen.

The same problem runs through the whole chain. Navigation, post-race analysis and sail-shape analysis each have their own Windows program, and their own file format. Each program adds its own layer of calculations on data that should be the same. After every outing, it took someone who knows the tools an hour to an hour and a half to extract the data: USB keys, dongle licenses.

But that software was written by people who have sailed for a long time, and it holds know-how the team could not recreate. The challenge is to modernize without losing it.

Then there are the rules. In the vast majority of races, outside help is forbidden: no information the competitors could not get. Internet on board is tolerated for now. And offshore, bandwidth is low, or zero.

## Three moments to equip

The team splits three moments:

1. **before the race**: prepare, so that the interface is as simple as possible afterwards, knowing every race is different;
2. **during**: the hardest, showing the right information at the right time (the start, a maneuver) without anyone touching the system;
3. **after**: analyze in more depth and compare with previous outings.

## Reaching the boat from the office

First obstacle: to work on the systems, you had to be on board, on the local network. The router's VPN was paid and worked badly. The team ended up installing Tailscale on the Raspberry Pi: from the office, you are on the boat's network.

From there, with Claude, the tools get rebuilt quickly. The data also goes to the cloud, so the whole crew can reach it without being on the tailnet, and everything keeps working locally on board. The first Grafana dashboard only shows raw data, but next to an hour of extraction after each outing, it is already another world.

## The numbers on the wrist

The Garmin watch app was written by an agent. Claude had access to the Garmin SDK and its simulator, like an iPhone simulator: it launched it from the command line and took screenshots. It produced versions for the crew's different watches. The app is not published: Garmin's review process is like the App Store's.

It shows the speed, the target, the percentage of the polar, and the average of the wind shifts over the last 10 minutes, to tell the tactician which side of the course pays. It reads the data from the boat when the boat answers, otherwise from the shore server: on board you do not want to depend on the cloud, but ashore the rest of the team wants to follow the race.

## Saying whether the boat is fast

The phone app has a performance screen and maneuver screens. This is where it gets hard: there is no absolute. In a regatta every boat is different, and each one races with a rating, like a golf handicap. You are ranked on corrected time, not on crossing the line. In a three-day race there is often no competitor nearby to compare with, and the gap comes down to 2 to 5% of speed.

The definition that works empirically for now: take all the legs at the same point of sail and in the same wind strength, say around 10 knots, and check whether the last 30 seconds are in the best 20% of the day.

For maneuvers, the sensors are enough to detect a tack or a gybe. The app takes the average speed over the 10 to 20 seconds before, and measures how long it takes to get back to 90% of that speed: the time lost, the distance lost.

Adrien says it himself: these are beginner versions of those algorithms. The team works with sailing professionals, who do not give away all their secrets.

## Local AI, on board

The newest part: running AI models on board, with a startup that sells edge AI, mostly for industrial production lines. It is Adrien's work-study project: testing their product on the boat.

On the hardware side, it is an Nvidia computer with a GPU. What the startup brings is the software: drivers, connectors and an application deployment stack, a bit like putting your AWS stack on one machine. No model ships with it, which is one of the pieces of feedback the team gave them. The machine exposes an MCP server: you connect Claude to it, and you can build an app very quickly from the data the navigation computer shares on the network.

You develop with Claude, then the machine runs disconnected: the boat can lose the network at any moment offshore, so everything that must work during a race runs locally.

### Transcribing the crew

On board, people talk all the time. A wireless microphone, worn on deck, is plugged into the machine through its receiver. A large Whisper model transcribes, then a French model puts each exchange in context: are we on a break, under sail, in a maneuver? The app was built with Claude, through the MCP, and deployed on the machine in two hours, model download included. It sorts the day into maneuvers and breaks, keeps the audio clips to listen to again, and even says whether the maneuver was good or not.

The first trial took place during a training weekend, two days before the talk. On the first day it was raining, 20 knots of wind (about 40 km/h), the microphone under a jacket: it worked.

The problem was the vocabulary. On board, people don't talk the way they do in the street: sailing jargon, sentences cut short to say as little as possible. The transcription got a lot wrong. The team gave it the boat's vocabulary, and now it looks for it everywhere: it even transcribes noise into sailing words. Factories probably have the same problem, with their own language.

### Why context

With raw data alone, you don't know what is happening. You don't know whether you tacked quickly because of a competitor or because of a rock, whether you are slow because you are sailing badly or because you are changing sails, or who is helming. Yet to calibrate the sensors or set target speeds, you have to sort good data from bad. Otherwise you either keep everything and get a lot of noise, or you sort without knowing how, at the risk of keeping only the best moments.

The goal is to gather all of it into a summary of the day. The sources overlap: the microphone hears that a given sail went up, the camera sees it, the data hints at it. And to turn feelings into evidence: when a crew member feels the boat is going well, does it show in the speed? The point is not to replace the crew, but to help it improve.

For now that work happens after the race, it is too heavy live. Whatever gets automated after the race, with AI or with an algorithm, then moves to live hints during the race. Upwind, for example, you can sail a bit higher and slower, or a bit lower and faster, and there may be a few tenths of a knot to gain on that trade-off. One day the app could say "try 2 degrees higher, 0.2 knots slower". We are not there.

## Next: looking at the sails

Next step: vision models on the sails, with cameras. The horizontal stripes on a sail are there for photos: sailmakers have long used them to measure the curvature, and to design the next sails. Measuring it live already exists, but costs around €25,000 and stays with the big teams. The team is collecting photos: about a hundred so far, it would need 1,000 or 2,000. Teams with big budgets protect their data, but a sail is still an airplane wing, and even a rough model should already help a lot.

## What stays hard

Adrien ended on this: even with today's tools, building something useful in the physical world stays hard. It takes work at the office, but also in the field to get all the hardware connected. And it is change management: people who have sailed the same way for 20 years make a huge effort to change how they trim the boat.

## Questions from the room

- **Why doesn't the navigator shelter inside?** There is nothing inside, it slams, and he has to see the race course and talk to the crew.
- **Do the sensors share a protocol?** Yes, they are marinized sensors, all on the same NMEA 2000 bus, except one analog one.
- **How is the racing going?** The boat won its championship this year. Thanks to training, not to the tech, according to the team: the tech is for the seasons to come.
