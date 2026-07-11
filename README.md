# React + Vite

# CSCI4830_TechExercise

## Author(s)

DMark

## How to Install and Run the Program

### Requirements

- Node.js: https://nodejs.org

- Git: https://git-scm.com/install/windows


### Download and Installation

To download the repo, run this in a terminal:

$ <code>git clone https://github.com/dmark250/CSCI4830_TechExercise.git</code>

Navigate to that directory

Then, install dependencies using npm by running this in the terminal:

$ <code>npm install</code>

### Running the Program

To Start the server running locally on your machine, navigate to the project directory in a terminal and run:

$ <code>npm run dev</code>

Now to open the web page do one of the following

1. Run in the same terminal:
    $ <code>o</code>
    This should open the web page in a browser.

2. Control click the localhost address that is shown in the terminal. This should do the same as 1. 

3. Navigate to the localhost address in a web browser.

## Release Notes

### 06/19/2026

Basic React Project Created Using Vite and Dexie.

Implemented a basic Entry tracker/editor. Entries can be Added, edited, deleted, and cleared. When entries have been finished being edited, they can be saved using Dexie and IndexedDB. Loading entries will overwrite all current entries. Both Clear and Load entries cause a popup ensuring you do not accidentally overwrite all data. The TechExercise text and Devin Mark texts are both links to the github repository and github repo of the author.

### 07/10/2026

Automated Testing Scripts Added

Automated testing was added using Vitest, Selenium, and fake-indexeddb. Unit tests are done using Vitest in the tests/unit directory to include basic tests for the App.jsx and Entry.js files. Selenium is used for Application System tests in the tests/system directory for creating, saving, and loading Entries. fake-indexeddb is used in the tests/integration directory for making a temporary IndexedDB database and testing the db.js functions properly update and load from the database.
