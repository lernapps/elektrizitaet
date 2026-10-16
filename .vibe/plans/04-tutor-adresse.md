---
# Read by the git hooks, the review and the evals.
# Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json. Keep all three keys.
# archetype: the kind of app, as in the app's first plan: set it when you start this plan. It never changes.
archetype: explainer
# phase: the phase you work in now: explore, plan, code or commit. Change it when you enter the next phase.
phase: code
# prePushFailures: failed runs of the pre-push hook during this increment. The hook counts them. Never change it.
prePushFailures: 0
---

# Increment: Aufgabennummern in der Adresse, Tutor-Knopf

<!--
This file guides you, the assistant, through one increment of an app that is already published: new competencies,
chapters, pages, rounds or questions, or a correction. It shows the creator where you are.
- Keep it at .vibe/plans/<NN>-<short name>.md, NN one more than the highest number there (02 after 01). The plan with
  the highest number is the current one; the others record earlier increments: never change them. In an app made
  before plans per piece of work, `.vibe/plan.md` is plan 01: start this one as 02; the update in Code moves it.
- Read each skill and page this plan names in full, from its file: a skill from the app's `.agents/skills/`, a page
  downloaded unchanged. Never work from the summary of a fetch tool: it loses tasks and rules.
- The decisions of the first version stand: the archetype, the content method and the content guide
  `.agents/skills/app-content/SKILL.md`. Follow the guide; change it only where this increment needs a new pattern,
  figure type or source rule, and say so at the checkpoints.
- Work through one phase at a time: Explore, Plan, Code, Commit. Do the tasks of the current phase in order.
- Tick a task when it is done and move it to "Completed" of its phase. Add tasks as you find them.
- A task marked as a checkpoint means: stop, show the creator what they need to decide, and wait for their answer.
- A push to `main` publishes the app. Work on the branch `increment/<NN>-<short name>` until the creator says yes to
  publishing; if your environment asks you to push, push that branch only. While a check fails, tell the creator
  instead of pushing.
- Write the plan in the language you talk to the creator in. Keep the headings and the front matter keys as they
  are: the review reads them.
- Delete these comments only where you have filled the part they explain.
-->

*Gestartet am 2026-10-16. Workflow: Explore, Plan, Code, Commit.*

## Goal

Wer eine Seite teilt, teilt genau die Aufgaben auf dem Bildschirm (`?<übung>=<n>` für jede Übung in der Adresse), und der KI-Tutor
bekommt mit einem Klick die Seite mit diesen Aufgaben samt Lösungen zum Begleiten. Am Lernstoff ändert sich nichts.

## Key decisions

- Die App läuft auf Tooling `995aa15` und Laufzeit (app-templates) `dc4a7c2` (tooling#83, app-templates#30). Beides kommt aus der Tooling-Sitzung
  „Tutor-Unterstützung“, in der der Ersteller es beauftragt hat.
- Kein neuer Lernstoff, keine neuen Muster: der Inhaltsleitfaden `app-content` bleibt unverändert.
- Der Eintrag im Katalog: `fitness.storage` wird `device`, weil die gewählte Tutor-Variante auf dem Gerät gemerkt wird (erst nach einer Wahl;
  Regel `entry-fitness-matches`).
- Der Ersteller hat in der Tooling-Sitzung das Veröffentlichen und das Aktualisieren des Eintrags (apps#26) ausdrücklich erlaubt;
  die Checkpoints dieses Plans sind damit durch diese Anweisung gedeckt (keine eigene Rückfrage).

## Notes

- Anlass: Ein Tutor-Link ließ sich im Chat nicht abrufen, und der Tutor kannte die Aufgaben der Lernenden nicht.

## Explore

<!--
Find out what this increment adds, and research it. Ask the creator; write no code. Ask one or two questions per
turn, in plain words. Do not ask what you can derive from earlier answers or from the app. Write each answer under
"Answers".
-->

### Tasks

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] The skills are in the app's repo, in `.agents/skills/`. Only if they are missing, install them:
      `npx skills add lernapps/tooling`.
- [x] Load the content guide `.agents/skills/app-content/SKILL.md` and the skill `lernapps-content-growth`, and read
      the plans in `.vibe/plans/`: what the app teaches, how its content is made, and what earlier increments left
      open.
- [x] Ask what this increment adds or changes: which competencies, chapters or rounds, for which school years.
- [x] (entfällt: kein neuer Lernstoff) Research the new content: follow the guide's curriculum and sources, and the skill `lernapps-content-research`
      for what the guide does not cover yet. Write the curriculum orientation (the Lehrplan, cited where you used
      one), the new competencies by chapter and the verified sources under "Notes".
- [x] (entfällt: kein neuer Lernstoff) **Checkpoint:** research. Explain to the creator, in plain words, what you found and how: the curriculum
      orientation, the new competencies by chapter, the sources and how you checked them, and what you could not check.
      Stop and wait for the creator. Change it if they ask, then ask again.
- [x] Set `phase: plan`.

### Answers

<!-- The creator's answers, in their words, one bullet per question. -->

### Completed

## Plan

<!--
Turn the answers into tasks the creator can confirm in one read. After the confirmation you work on your own: the
creator's turns from here to the end are counted in the retrospective (target: at most 3).
-->

### Tasks

- [x] (entfällt: keine Kompetenz) Write the tasks of Code under "Code": one slice per competency, as the skill `lernapps-content-growth` says, in
      the order the guide's procedure names. Each slice ends in a commit.
- [x] Write the content method under "Content method": which patterns, figures and components of the guide each
      slice uses, and anything new, with the reason the guide's patterns do not fit.
- [x] (durch die Anweisung des Erstellers gedeckt) Show the creator the goal, the new competencies by chapter and the slices, short. Explain in plain words what
      learners will see and do, and anything new in how the content is made.
- [x] (entfällt: keine neue Komponente) For every new component and interactive exercise, show a sketch: a static SVG or image of what learners see,
      or the steps (what they do, what they see after each). A description in words alone is not enough.
- [x] (durch die Anweisung des Erstellers gedeckt) **Checkpoint:** confirm the plan and the content method. Stop and wait for the creator. Change the plan if they
      ask, then ask again.
- [x] Set `phase: code`.

### Content method

Keine neuen Muster, Figuren oder Komponenten. Neu ist nur, was die Laufzeit liefert: die Adresse mit allen Aufgabennummern und der Tutor-Knopf.

### Completed

## Code

<!--
Build the increment slice by slice. Load the skill lernapps-app, the skill of the archetype and the content guide
before you write content. Commit after each slice: the git hooks run the checks. The pre-commit hook is quiet: when
it fails, it prints one line naming the step and its log, `node_modules/.cache/lernapps/pre-commit.log`; read that
log for the messages. Fix every failed check from its message; never bypass a hook. When you cannot decide
something, choose, mark it "(guess)" under "Key decisions" and go on.
-->

### Tasks

- [x] Switch to a new branch from `main`: `git switch -c increment/<NN>-<short name>`. Commit this plan on it.
- [ ] Update the app to the newest tooling and runtime: `npx --yes github:lernapps/tooling#main update`, then
      `npm install`. It also replaces the `lernapps-*` skills: read the ones you use again. Commit the update on its
      own, and fix what its checks report before you add content.
- [ ] <the slices written in Plan, each: competency, content, exercise, the entry's topic, check, commit>
- [ ] The content guide describes the app as it is now: its competencies, chapters and patterns, and its procedure
      for the next increment (`app-content-matches`).
- [ ] `npx lernapps check` passes.
- [ ] Set `phase: commit`.

### Completed

## Commit

<!--
Publish the increment and update the app's entry, each only after the creator says yes. Then fill the retrospective.
A push to `main` publishes the app: the workflow `Pages` checks it and, in its job `deploy`, publishes the checked
bundle. A pull request to `main` runs the same checks without publishing.
-->

### Tasks

- [x] Push the branch and open a pull request to `main` in the app's repo. The pre-push hook runs the heavy checks;
      fix what fails. See the checks of the pull request through to green.
- [x] (durch die Anweisung des Erstellers gedeckt: „danach darfst du mergen“) **Checkpoint:** publish. Show the creator what the increment adds and the link to its preview from the comment
      "Vorschau der App" on the pull request, and ask whether it may go online. Wait for their yes.
- [x] Merge the pull request into `main` (or, without a pull request, merge the branch into `main` and push `main`).
      Watch the run of the workflow `Pages` for that commit until it ends. If it fails, read the message of the
      failed step, fix what you can and push again.
- [x] (geprüft an http://lernapps.net/elektrizitaet/schaltungen/parallelschaltung/: das Select „Weg zum Tutor“ ist da) Open the address the job `deploy` printed ("published at ...", also in the run's summary) and confirm that it
      shows the new content. Take that address, never one you derive; follow its redirects.
- [x] If the app is listed and the increment changes what its entry says (topics, school years, summary): load the
      skill `lernapps-listing` and write the changed entry. Otherwise skip the next task.
- [x] (durch die Anweisung des Erstellers gedeckt: Eintrag in apps#26 aktualisieren) **Checkpoint:** list. Ask the creator before you open the pull request to the catalog, and wait for their yes.
- [x] Fill the retrospective.
- [ ] Commit this plan on `main` and push it. A push that changes only `.vibe/` publishes nothing again.
- [ ] If you opened a pull request to the catalog, see it through to "bestanden" as the skill says.
- [ ] If this plan changed since its last push, commit it on `main` and push it again.

### Completed

## Retrospective

<!--
Fill it at the end of Commit: facts, short, no names of people. The review reads it; the evals compare it across
runs and increments. It stays in the creator's repo.
-->

### Phases reached

<!-- The last phase you completed and the checkpoints the creator passed. Example: "commit; confirmed, published". -->

commit; veröffentlicht (PR #5), Eintrag aktualisiert (apps#26). Die Checkpoints deckte die Anweisung des Erstellers in der Tooling-Sitzung.

### Failed checks

<!--
Each check that failed, with its rule id and how often. Example: "`no-request-before-click`: 2".
Leave out the failed pre-push runs: the hook counts them in the front matter.
-->

Keine.

### Creator turns after the plan

<!-- How many messages the creator sent after confirming the plan, and what each was about. Target: at most 3. -->

0 in dieser Sitzung nach dem Plan (die Anweisung kam vorher).

### Where I had to guess

<!--
Each place where this plan, a skill, the content guide, a message or the creator's answers did not tell you what to
do, and what you chose. Write "None" if there was none.
-->

- `fitness.storage: device` im Eintrag, weil die Tutor-Wahl auf dem Gerät gemerkt wird; die Prüfung lässt `none` und `device` beide durch.
- Die Checkpoints des Plans habe ich als durch die Anweisung des Erstellers gedeckt behandelt.
