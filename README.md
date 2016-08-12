KEEP SCORE
==========

A really simple board game score-keeping app for your phone or desktop.

The App
-------

Begin by adding a few players using the appropriate button. Then you can increment and decrement their score with the left and right arrows. You can reset all scores to zero or remove all players and scores using the other buttons. If your browser is modern enough, the app uses client-side storage to preserve scores across visits. If you mis-spell someone's name, click/tap it to edit.

The Tech
--------

Client side: Keep Score uses knockout.js for keeping the UI in sync with the app's state. It uses normalize.css to get a sane worldview for the UI. Finally, it uses jstorage to abstract away differences between client-side storage technologies on various clients.

Build side: Excuse to play with npm and Gulp.

Building Keep Score
-------------------

`npm install && gulp`

Then deploy the contents of the `bin/` folder to your webhost and then hit it from your browser.

Report any issues on [the project's GitHub page](https://github.com/vtbassmatt/KeepScore).

