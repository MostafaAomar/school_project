# منصتي التعليمية

This folder contains the school learning platform, UniQuiz, and the CV builder
with shared project navigation and a persistent light/dark appearance setting.
The installed app opens directly to the school project; there is no separate
landing page.

## Run locally

Serve this folder over HTTP (service workers and app installation do not work
from a `file://` URL). For example, from this folder run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/school_project/index.html`.

## Publish and install

Publish the entire `new project` folder, preserving its subfolders. Open the
school, university, or CV project over HTTPS and use the browser's **Install
app** action. All projects share a single manifest, service worker, project
menu, and appearance setting. Same-origin resources are cached as they are
used. UniQuiz keeps its own subject download and offline storage behavior.
