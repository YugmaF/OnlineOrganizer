# Online Organizer

A simple event scheduling app built with AngularJS and Material Design. Users can add, view,
edit, and delete events on a calendar. The app highlights the next upcoming event and supports
toaster notifications for overdue or added events.

## Features
- Add events with name, date (via calendar), and time (via jQuery time picker)
- View nearest upcoming event for selected date or overall
- List all events grouped and sorted by date and time
- Edit or delete events with confirmation
- Toaster popups for errors and overdue events

## Live Demo
Open the app locally by running:
```bash
npm install
npm start
# then visit http://localhost:8000/index.html
```

## Development

Clone the repo:
```bash
git clone https://github.com/YugmaF/OnlineOrganizer.git
cd OnlineOrganizer
```

Install dependencies and copy AngularJS libraries:
```bash
npm install
npm run copy-libs
```

Run tests (unit and E2E):
```bash
npm test           # Karma unit tests
npm run protractor # Protractor E2E tests
```

## Project Structure
```
OnlineOrganizer/
├── app/                # AngularJS application source
│   ├── assets/         # static assets (images, plugins)
│   ├── core/           # version module & filters
│   ├── app.js          # main Angular module and controller
│   ├── index.html      # synchronous loader page
│   └── index-async.html# async loader with script.js
├── e2e-tests/          # end-to-end test suites
├── karma.conf.js       # Karma config for unit tests
├── package.json        # npm scripts and dependencies
├── protractor.conf.js  # E2E testing config
└── README.md           # this file
```

## Dependencies
- AngularJS 1.7.x, Angular Material, ngAnimate, AngularJS Toaster
- Bootstrap 4, jQuery 3.x, Popper.js
- mdtimepicker plugin for time selection

## License
MIT © YugmaF

---
Built and maintained by the OnlineOrganizer team.
