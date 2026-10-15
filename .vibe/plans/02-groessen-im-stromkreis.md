---
# Read by the git hooks, the review and the evals.
# Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json. Keep all three keys.
# archetype: the kind of app, as in the app's first plan: set it when you start this plan. It never changes.
archetype: explainer
# phase: the phase you work in now: explore, plan, code or commit. Change it when you enter the next phase.
phase: commit
# prePushFailures: failed runs of the pre-push hook during this increment. The hook counts them. Never change it.
prePushFailures: 0
---

# Increment: Größen im Stromkreis (Klasse 7 und 8)

<!--
This file guides you, the assistant, through one increment of an app that is already published: new competencies,
chapters, pages, rounds or questions, or a correction. It shows the creator where you are.
- Keep it at .vibe/plans/<NN>-<short name>.md, NN one more than the highest number there (02 after 01). The plan with
  the highest number is the current one; the others record earlier increments: never change them. In an app made
  before plans per piece of work, `.vibe/plan.md` is plan 01: start this one as 02; the update in Code moves it.
- Read each skill and page this plan names in full, from its file: a skill where `npx skills add lernapps/tooling`
  installed it, a page downloaded unchanged. Never work from the summary of a fetch tool: it loses tasks and rules.
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

*Gestartet am 2026-10-15. Workflow: Explore, Plan, Code, Commit.*

## Goal

Lernende der Klassen 7 und 8 lernen Stromstärke, Spannung, Widerstand und das ohmsche Gesetz kennen, messen und berechnen
sie und wenden sie auf Reihen- und Parallelschaltungen an. Davor konnten sie Stromkreise nur qualitativ beschreiben.

## Key decisions

- Archetyp `explainer` wie in Plan 01; Inhaltsleitfaden `app-content` und seine Muster gelten weiter.
- Lehrplanzitat Bayern (Gymnasium, Jahrgangsstufe 8) nur in Plan und Leitfaden; die Lerntexte nennen kein Land (Wunsch der
  Auftraggeberin bzw. des Auftraggebers).
- Kapitel heißen nach dem Thema („Größen im Stromkreis“, „Schaltungen mit Messgeräten“), nicht „Gleichstrom“: die Größen gelten
  auch für Wechselstrom. Die Einleitung und der Leitfaden sagen „Gleichstrom“; Wechselstrom kommt später als eigenes Kapitel
  `wechselstrom` hinter diesen (Vorschlag bestätigt).
- Reihen- und Parallelschaltung üben „erst vorhersagen, dann messen“ (guess; vorgeschlagen, nicht ausdrücklich bestätigt).
- Der alte Bau-Editor (Klasse 5/6) wird ersetzt, nicht behalten („A“): Logik bleibt, Anzeige und Platz auf den Seiten ändern sich.
- Änderung nach der Vorschau (Wunsch der Auftraggeberin bzw. des Auftraggebers): Der separate „Bau-Editor mit Messgeräten“ und
  seine Texteingaben entfallen. Die Interaktion wird sichtbar und steckt in den Übungen jeder Seite: ein gezeichneter
  Stromkreis, in dem man Strom, Spannung und Messgeräte sieht, mit Aufgaben, deren Werte sich ändern und die geprüft werden.
- Erweiterung als Kapitel „Größen im Stromkreis“ für Klasse 7 und 8 (Wunsch der Auftraggeberin bzw. des Auftraggebers).

<!--
One line each: the decision and why. Add decisions in any phase.
Mark a choice you made without asking the creator with "(guess)", and list it in the retrospective.
-->

## Notes

- Lehrplan (vom Auftraggeber bestätigt; nur hier und im Inhaltsleitfaden zitiert, nicht in den Lerntexten): „Fachlehrplan Physik 8 – Phänomene experimentell untersuchen
  und modellieren“, Gymnasium Bayern, Jahrgangsstufe 8, ISB, LehrplanPLUS,
  https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/physik (geöffnet 2026-10-15), Lernbereich 1 „Elektrischer
  Strom“, ca. 14 Std.: Stromkreismodell, Stromstärke, Spannung, Widerstand (Definitionsgleichung), Kennlinien, Reihen- und
  Parallelschaltung (höchstens drei Widerstände), Kurzschluss, Haushaltsinstallation. Das ohmsche Gesetz steht dort nicht
  ausdrücklich (nur „Ohm'scher und nicht-Ohm'scher Widerstand“).
- Weitere Länder: nicht geöffnet. Sachsen (Klasse 7/8, Stromstärke und Spannung, 18 Std.), Baden-Württemberg und NRW
  (Heft 3411, Gymnasium 2019) nur in Suchtreffern gesehen, nicht geprüft.
- Vorläufige Kompetenzen (Entwurf, noch nicht bestätigt), Kapitel `groessen` (Größen im Stromkreis):
  Stromstärke und Amperemeter; Spannung und Voltmeter; Widerstand; ohmsches Gesetz (U = R · I); Reihen- und
  Parallelschaltung mit Größen; Bau-Editor mit Messgeräten.
- Quellen, geöffnet und geprüft am 2026-10-15 (richtiger Artikel, keine Begriffsklärung; Fakten, nicht Formulierungen):
  - https://de.wikipedia.org/wiki/Elektrische_Stromst%C3%A4rke, „Elektrische Stromstärke“ (Ampere; Amperemeter in Reihe;
    behandelt Parallelschaltung nicht).
  - https://de.wikipedia.org/wiki/Elektrische_Spannung, „Elektrische Spannung“ (Volt).
  - https://de.wikipedia.org/wiki/Elektrischer_Widerstand, „Elektrischer Widerstand“ (Ohm; R = ρ · l / A).
  - https://de.wikipedia.org/wiki/Ohmsches_Gesetz, „Ohmsches Gesetz“ (U = R · I).
  - Serlo (geöffnet 2026-10-15): Physik ist dort „Fächer im Aufbau“; „Grundbegriffe der Elektrizitätslehre“ und „Stromkreise mit
    ohmschen Widerständen“ sind nur Seiten mit Titel ohne Inhalt. Kein Artikel zu Stromstärke, Spannung, Widerstand, ohmschem
    Gesetz: nicht verwendet.
  - LeifiPhysik: HTTP 403, nicht geprüft, nicht verwendet (kein Umgehen).
- Vorgeschlagene Kompetenzen (Entwurf für den Checkpoint „Recherche“):
  Kapitel `groessen` (Größen im Stromkreis)
  - Ich kann die Stromstärke in A und mA angeben, am Amperemeter ablesen und das Amperemeter richtig einbauen.
    Seite `groessen/stromstaerke`.
  - Ich kann Spannung als „Antrieb“ des Stroms erklären, in V angeben, am Voltmeter ablesen und es richtig anschließen.
    Seite `groessen/spannung`.
  - Ich kann erklären, wovon der Widerstand eines Drahts abhängt (Material, Länge, Querschnitt), und ihn in Ω angeben.
    Seite `groessen/widerstand`.
  - Ich kann mit R = U / I eine fehlende Größe berechnen und eine Kennlinie lesen. Seite `groessen/ohmsches-gesetz`.
  Kapitel `schaltungen-messen` (Schaltungen mit Messgeräten)
  - Ich kann Stromstärke und Spannung in einer Reihenschaltung mit bis zu drei Widerständen vorhersagen und berechnen.
    Seite `schaltungen-messen/reihenschaltung`.
  - Ich kann dasselbe in einer Parallelschaltung (zwei Zweige, in einem bis zu zwei Widerstände). Seite
    `schaltungen-messen/parallelschaltung`.
  - Ich kann eine Schaltung mit Messgeräten und Widerständen bauen, die vorgegebene Werte erfüllt. Seite
    `schaltungen-messen/bau-editor`; Komponente `SchaltungMessen`.
- Bau-Editor mit Variablen: Die Komponenten-Schnittstelle des Explainers trägt das schon (`generate(seed, props)` gibt die
  Aufgabe, eine Prüffunktion urteilt, 50 feste Startwerte werden gebaut und getestet). Der Simulator rechnet Spannung und
  Strom idealisiert (Gleichstrom, ideale Quelle und Messgeräte, bis zu drei Widerstände) und prüft das Verhalten der
  Schaltung, nicht ihren Aufbau. Aufgaben ziehen sinnvolle Werte aus Listen (Quelle 6, 9, 12 V; Widerstände aus 10, 20,
  30, 50, 100 Ω); die Lösung wird gerechnet, nicht gespeichert.

<!-- What you need later: sources and licences of content, links, open questions. -->

## Entry draft

Ergänzung des Katalogeintrags (Änderung per Pull Request an den Katalog, erst nach der Veröffentlichung; Schema vorher
laden, `entry-from-schema`):

```yaml
grades: [5, 6, 7, 8]
topics:
  # neu (der Bau-Editor `schaltungen/bau-editor/` ist entfallen: sein Thema im Katalogeintrag ersetzen durch die Seiten,
  # auf denen die Bauaufgaben jetzt stehen: schaltungen/schalter-schaltzeichen/, schaltungen/reihenschaltung/,
  # schaltungen/parallelschaltung/):
  - { title: Die Stromstärke, path: groessen/stromstaerke/ }
  - { title: Die Spannung, path: groessen/spannung/ }
  - { title: Der Widerstand, path: groessen/widerstand/ }
  - { title: Das ohmsche Gesetz, path: groessen/ohmsches-gesetz/ }
  - { title: Reihenschaltung mit Messgeräten, path: schaltungen-messen/reihenschaltung/ }
  - { title: Parallelschaltung mit Messgeräten, path: schaltungen-messen/parallelschaltung/ }
keywords: [Stromstärke, Spannung, Widerstand, ohmsches Gesetz, Gleichstrom, Amperemeter, Voltmeter]
```

Die Zusammenfassung nennt dann auch Stromstärke, Spannung, Widerstand und das ohmsche Gesetz (Klasse 7 und 8).

## Explore

<!--
Find out what this increment adds, and research it. Ask the creator; write no code. Ask one or two questions per
turn, in plain words. Do not ask what you can derive from earlier answers or from the app. Write each answer under
"Answers".
-->

### Tasks

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] Install the skills, if they are not installed yet: `npx skills add lernapps/tooling`.
- [x] Load the content guide `.agents/skills/app-content/SKILL.md` and the skill `lernapps-content-growth`, and read
      the plans in `.vibe/plans/`: what the app teaches, how its content is made, and what earlier increments left
      open.
- [x] Ask what this increment adds or changes: which competencies, chapters or rounds, for which school years.
- [x] Research the new content: follow the guide's curriculum and sources, and the skill `lernapps-content-research`
      for what the guide does not cover yet. Write the Lehrplan with its citation, the new competencies by chapter
      and the verified sources under "Notes".
- [x] **Checkpoint:** research. Explain to the creator, in plain words, what you found and how: the Lehrplan with its
      citation, the new competencies by chapter, the sources and how you checked them, and what you could not check.
      Stop and wait for the creator. Change it if they ask, then ask again.
- [x] Set `phase: plan`.

### Answers

- Die App soll um die nächsten Jahrgänge wachsen. Nach meinem Vorschlag (Spannung, Stromstärke, Widerstand, ohmsches
  Gesetz, später Leistung/Energie, Magnetismus): „Größen im Stromkreis klingt gut.“
- Bau-Editor: „Ohne den Editor ist es lahm. Der sollte auch Übungen mit Variablen unterstützen, also so, dass man sinnvolle
  Werte nutzt, diese aber von Übung zu Übung variiert und dennoch geprüft werden können.“
- Zum Checkpoint „Recherche“ (Kompetenzen, Kapitel, Editor mit Variablen, Quellen): „ich finde das so gut.“
- Nach der Vorschau: „die Interaktivität ist überhaupt nicht visuell. so sind die Übungen überhaupt nicht wertvoll“; „ich finde den
  separaten Bau-Editor ehrlicherweise nicht hilfreich: Ich würde das gerne in die Übungen integrieren“.
- Zum Checkpoint „Plan“ (Wunsch: später Wechselstrom ergänzen können; Vorschlag mit Themennamen): „Dein Vorschlag ist ok. leg los.“
- Lehrplan: „nimm Bayern als Lehrplanzitat, aber im Inhalt sollte das nicht auftauchen.“

### Completed

## Plan

<!--
Turn the answers into tasks the creator can confirm in one read. After the confirmation you work on your own: the
creator's turns from here to the end are counted in the retrospective (target: at most 3).
-->

### Tasks

- [x] Write the tasks of Code under "Code": one slice per competency, as the skill `lernapps-content-growth` says, in
      the order the guide's procedure names. Each slice ends in a commit.
- [x] Write the content method under "Content method": which patterns, figures and components of the guide each
      slice uses, and anything new, with the reason the guide's patterns do not fit.
- [x] Show the creator the goal, the new competencies by chapter and the slices, short. Explain in plain words what
      learners will see and do, and anything new in how the content is made.
- [x] **Checkpoint:** confirm the plan and the content method. Stop and wait for the creator. Change the plan if they
      ask, then ask again.
- [x] Set `phase: code`.

### Content method

- Seiten wie bisher: Sektionen `idee`, `merke`, `beispiel`, `uebung`; eine Kompetenz je Seite; Fachwörter als `definition`.
- Muster Einordnen, Vorhersagen, Beurteilen (Quizfragen mit `info` je Option) für Messgeräte, Anschluss und Schaltungsregeln,
  zum Beispiel „Wie wird das Amperemeter eingebaut?“ oder „Was zeigt Messgerät 3 an?“.
- Neues Muster Rechnen: `generated`-Aufgaben mit Zahlen aus sinnvollen Listen (Spannung 3 bis 12 V, Widerstände 10 bis 100 Ω),
  Einheiten mit `\pu{…}`, Antwort mit Einheit; typische Fehler mit Rückmeldung („U · I statt U / I“, „mA nicht
  umgerechnet“, „Ströme in der Reihenschaltung addiert“). Der Build prüft jede Aufgabe an 200 festen Startwerten.
- Figuren: eigene SVG-Zeichnungen in `src/images/`, ohne Wörter, nur Ziffern mit Legende in der Bildunterschrift, wie bisher;
  Messgeräte als Kreis mit A oder V; Kennlinie als Zeichnung mit Ziffern an den Achsen. Kein Land, keine Marke.
- Komponente `SchaltungMessen` (neu, neben `SchaltungBauen`): grafisches Schaltbrett mit Quelle, bis zu drei Widerständen und
  Messgeräten auf festen Plätzen. Jede Aufgabe entsteht aus einem Startwert (`generate(seed, props)`): Quellspannung aus
  6, 9 oder 12 V, Widerstände aus 10, 20, 30, 50, 100 Ω, Zielwert so gewählt, dass es eine Lösung gibt. Die Prüffunktion
  rechnet, was die gebaute Schaltung am Messgerät zeigt, und vergleicht es mit dem Ziel (Toleranz, Rundung genannt); sie prüft
  das Verhalten, nicht den Aufbau, daher gelten mehrere Lösungen. Der Build testet viele Startwerte: gleiche Aufgabe bei
  gleichem Startwert, Lösbarkeit, keine Aufgabe, die schon im Ausgangszustand erfüllt ist. Ohne JavaScript zeigt `nojs`
  eine Beispielaufgabe mit Lösung.
- Was die Komponente nicht kann: Wechselstrom, Innenwiderstand von Quelle und Messgeräten, nicht-ohmsche Bauteile (Lampen
  haben hier einen festen Widerstand), mehr als drei Widerstände, Leistung, Helligkeit.
- Ein späterer Agent fügt Kapitel nach dem Abschnitt „Adding a chapter or round“ des Leitfadens hinzu; neue Werte-Listen
  für die Aufgaben stehen in `SchaltungMessen.ts` und im Leitfaden.

<!--
One line each: the guide's patterns, figures and components this increment uses, and where; anything new (a pattern,
a figure type, a component, a source rule), what it does and what it cannot do. New things go into the guide in
the slice that adds them.
-->

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

- [x] Switch to a new branch from `main`: `git switch -c increment/02-groessen-im-stromkreis`. Commit this plan on it.
- [x] Update the app to the newest tooling and runtime: `npx --yes github:lernapps/tooling#main update`, then
      `npm install`. Move `.vibe/plan.md` to `.vibe/plans/01-first-version.md` (the update does it, else by hand).
      Commit the update on its own, and fix what its checks report before you add content.
- [x] Slice 1: kapitel `groessen` (`chapter.yaml`, Eintrag in `src/app.yaml`) und Seite `groessen/stromstaerke`
      (Amperemeter, A und mA); Bild der Messung in Reihe; drei Übungen; Thema im Katalogeintrag; Check; Commit.
- [x] Slice 2: Seite `groessen/spannung` (Spannung als Antrieb, Voltmeter parallel); Bild; drei Übungen; Thema; Check; Commit.
- [x] Slice 3: Seite `groessen/widerstand` (Material, Länge, Querschnitt, Ω); Bild; drei Übungen; Thema; Check; Commit.
- [x] Slice 4: Seite `groessen/ohmsches-gesetz` (R = U / I, Kennlinie); Bild der Kennlinie; Übungen mit `generated`
      (Rechnen mit Einheiten, typische Fehler); Thema; Check; Commit.
- [x] Slice 5: Kapitel `schaltungen-messen` und Seite `reihenschaltung` (Stromstärke gleich, Spannungen addieren sich, bis
      zu drei Widerstände); Bild; Übungen mit `generated`; Thema; Check; Commit.
- [x] Slice 6: Seite `schaltungen-messen/parallelschaltung` (Spannung gleich, Ströme addieren sich, zwei Zweige); Bild;
      Übungen mit `generated`; Thema; Check; Commit.
- [x] Slice 7: Komponente `SchaltungMessen`: Logik in `SchaltungMessen.ts` (Schaltungsmodell, Rechner für Strom und
      Spannung, Aufgaben aus einem Startwert, Prüffunktion), Test über viele Startwerte, dann Oberfläche
      (`SchaltungMessen.vue`); Seite `schaltungen-messen/bau-editor` mit Quizfrage; Thema; Check; Commit.
- [x] Der Katalogeintrag (Entwurf unten): Klassen 5 bis 8, Zusammenfassung, Themen aller neuen Seiten; `src/app.yaml`
      (Einleitung, Quellen) aktualisiert; kein Land in den Lerntexten.
- [x] The content guide describes the app as it is now: its competencies, chapters and patterns, and its procedure
      for the next increment (`app-content-matches`). Lehrplanzitat Bayern steht im Abschnitt „Curriculum“.
- [x] Alle Texte in Deutsch und Englisch, beide vollständig.
- [x] Umbau (bestätigt): die Interaktion wird sichtbar und steckt in den Übungen jeder Seite; der separate Bau-Editor mit
      Messgeräten entfällt, der alte Bau-Editor (Klasse 5/6) wird auf die Seiten verteilt. Gemeinsame Bausteine: `Fluss` (Strom
      als laufende Punkte: Dichte und Tempo wachsen mit der Stromstärke, ohne Bewegung bei reduzierter Animation), `Zeiger`
      (Messgerät mit Zeiger und Zahl). Jede Übung zieht ihre Zahlen aus einem Startwert und prüft, was die Messgeräte zeigen.
- [x] Slice 8: Bausteine `src/components/Fluss.vue`, `Zeiger.vue`, `messen.ts` (Zufall, Runden, Formatieren, Flussdichte).
- [x] Slice 9: `StromMessen` (Amperemeter an der richtigen Stelle einbauen, parallel zur Quelle ist ein Kurzschluss; Widerstand
      wählen, bis der Zielstrom fließt) auf `groessen/stromstaerke`; Test; Check; Commit.
- [x] Slice 10: `SpannungMessen` (Voltmeter an zwei Punkte des Kreises anschließen, die Leitungen sind nach Höhe der Spannung
      gefärbt) auf `groessen/spannung`; Test; Check; Commit.
- [x] Slice 11: `DrahtLabor` (Länge und Dicke eines Drahts einstellen, bis der Strom mindestens k-mal so groß ist) auf
      `groessen/widerstand`; Test; Check; Commit.
- [x] Slice 12: `OhmLabor` (Spannung einstellen, Messpunkte setzen, Kennlinie wächst, Widerstand angeben) auf
      `groessen/ohmsches-gesetz`; Test; Check; Commit.
- [x] Slice 13: `SchaltungVorhersage` (Strom oder Spannung vorhersagen, einschalten, vergleichen) auf
      `schaltungen-messen/reihenschaltung` und `parallelschaltung`; Test; Check; Commit.
- [x] Slice 14: `SchaltungBauen` bekommt laufende Punkte und wird auf `schaltungen/schalter-schaltzeichen` (Ziele `eine`,
      `schalter`), `schaltungen/reihenschaltung` (`reihe`) und `schaltungen/parallelschaltung` (`parallel`, `je-schalter`,
      `haupt`) eingesetzt, `be-kurzschluss` zieht auf `parallelschaltung`; die Seiten `schaltungen/bau-editor` und
      `schaltungen-messen/bau-editor` und die Komponente `SchaltungMessen` entfallen (der Explainer kann keine Weiterleitung
      schreiben: die alte Adresse gibt danach 404, und der Katalogeintrag muss den Themenpfad `schaltungen/bau-editor/` ersetzen);
      Check; Commit.
- [ ] The content guide describes the app as it is now: its competencies, chapters and patterns, and its procedure
      for the next increment (`app-content-matches`).
- [x] `npx lernapps check` passes.
- [x] Set `phase: commit`.

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
- [x] **Checkpoint:** publish. Show the creator what the increment adds, and ask before it goes online. Wait for
      their yes.
- [x] Merge the pull request into `main` (or, without a pull request, merge the branch into `main` and push `main`).
      Watch the run of the workflow `Pages` for that commit until it ends. If it fails, read the message of the
      failed step, fix what you can and push again.
- [x] Open the address the job `deploy` printed ("published at ...", also in the run's summary) and confirm that it
      shows the new content. Take that address, never one you derive; follow its redirects.
- [x] If the app is listed and the increment changes what its entry says (topics, school years, summary): load the
      skill `lernapps-listing` and write the changed entry. Otherwise skip the next task.
- [x] **Checkpoint:** list. Ask the creator before you open the pull request to the catalog, and wait for their yes.
- [x] Fill the retrospective.
- [x] Commit this plan on `main` and push it. A push that changes only `.vibe/` publishes nothing again.
- [x] If you opened a pull request to the catalog, see it through to "bestanden" as the skill says.
- [x] If this plan changed since its last push, commit it on `main` and push it again.

### Completed

## Retrospective

<!--
Fill it at the end of Commit: facts, short, no names of people. The review reads it; the evals compare it across
runs and increments. It stays in the creator's repo.
-->

### Phases reached

Commit abgeschlossen. Bestätigt vom Ersteller: Recherche, Plan und Inhaltsmethode, Umbau der Interaktion, Ersetzen des alten Bau-Editors,
Veröffentlichung (er führte den Pull Request #3 selbst zusammen; der Lauf `Pages` für `e762d07` war erfolgreich, die Adresse
http://lernapps.net/elektrizitaet/ zeigt die neuen Seiten), Änderung des Eintrags im bestehenden Listing-Pull-Request
(lernapps/apps#26). Dessen Prüfung meldet „bestanden“ (9 Regeln); die Entscheidung über den Eintrag liegt bei lernapps.net.

### Failed checks

- `checks-pass`: 1 (Typfehler im Test der ersten Messen-Komponente, `vue-tsc`; der Commit lief trotzdem durch, die volle Prüfung
  meldete ihn danach).
- `entry-links-resolve`: 1 (der alte Eintrag im offenen Listing-Pull-Request nannte das entfallene Thema `schaltungen/bau-editor/`, 404;
  gefunden bei der Prüfung vor dem Ändern des Eintrags, nicht im Pull Request).
- `explainer-content-valid`: 6 beim Bauen (Prop-Typ als importierter Alias, Prop mit `null`, Text `resistor` ohne Feld in der Komponente,
  Übersetzung der Einheit fehlte, Einrückung in `chapter.yaml`, Hilfsdateien in `src/components/` ohne zugehörige Komponente und Test).

### Creator turns after the plan

14 Nachrichten nach der Bestätigung des Plans, Ziel höchstens 3 verfehlt: (1) Ja zur Anweisung der Tooling-Sitzung (Update, Pull Request);
(2) die Interaktivität sei nicht visuell, die Übungen deshalb nicht wertvoll; (3) der separate Bau-Editor sei nicht hilfreich, die
Interaktion solle in die Übungen; (4) Ersetzen des alten Bau-Editors ist in Ordnung; (5) „A“; (6) Rückmeldung zur Vorschau: Bauen,
dann Strom einschalten und prüfen, lange Beschreibung unter der Übung, unklare Bauaufgaben, „Lösung“ vor der Antwort; (7) Bildschirmfoto
einer richtig gebauten Schaltung, die als falsch bewertet wurde; (8) Bildschirmfoto einer Sortierübung, deren Reihenfolge egal ist, mit dem Hinweis auf ein systematisches Problem der Modellierung
der Prüfungen; (9) Bitte um Aufnahme in die Retrospektive, der Rest der Vorschau gefalle; (10) „und?“ nach der Veröffentlichung; (11) Bitte, die Tooling-Sitzung
auf diese Sitzung hinzuweisen; (12) Frage, ob der Pull Request noch offen sei; (13) Adresse des Listing-Pull-Requests; (14) „Ergänze den alten PR“.
Ursache der Nachrichten 2 bis 8: Die Interaktion wurde nach Wunsch „Bauen“ geplant (Rechner mit Kästchen und Texteingabe), ohne vorher ein
Bild davon zu zeigen; der Ersteller sah sie erst in der Vorschau.

### Where I had to guess

- Reihen- und Parallelschaltung üben „erst vorhersagen, dann messen“ (nicht ausdrücklich bestätigt).
- Typische Werte im Text (Föhn etwa 9 A, Taschenlampenlämpchen etwa 200 mA) stehen nicht in den geprüften Quellen.
- Das ohmsche Gesetz steht im zitierten Lehrplan nicht ausdrücklich; aufgenommen, weil andere Länder es in diesen Jahrgängen behandeln.
- Den bestehenden Listing-Pull-Request ergänzt, statt einen neuen zu öffnen (Entscheidung des Erstellers).
- Wasserbild als Modell für Strom, Spannung und Widerstand, mit dem Hinweis auf seine Grenzen.
- Die Batterie ist in den neuen und geänderten Bildern einheitlich gezeichnet (lange dünne Platte oben als Plus); die älteren Bilder
  hatten sie vertauscht.

Für den nächsten Agenten (Beobachtungen aus der Vorschau; die erste hat der Ersteller zur Aufnahme in die Retrospektive vorgegeben):
- **Zu strenge Prüfung:** Die Aufgabe „Baue einen Stromkreis mit einer Lampe“ lehnte eine Schaltung mit Lampe und Schalter ab, obwohl die
  Lampe leuchtete (`meets("eine")` verlangte null Schalter, der Text sagt das nicht). Geprüft werden soll das, was der Aufgabentext
  sagt, und die Rückmeldung soll den Grund nennen: Das Template meldet nur „Leider nicht richtig.“, deshalb zeigt `SchaltungBauen` nach dem
  Prüfen selbst, was fehlt (`diagnose`). Die Prüfung jeder neuen Aufgabe an den Beispielen testen, die Lernende wirklich bauen.
- **Systematisches Modellierungsproblem (Ersteller, in zwei Nachrichten bemerkt, nicht von der App oder den Prüfungen gemeldet):** Eine Prüfung
  war Gleichheit mit einer Musterlösung statt die Eigenschaft, die der Text verlangt. Die Prüfungen der App fanden das nicht; erst der
  Ersteller beim Ausprobieren der Vorschau, am Bildschirmfoto einer richtig gebauten, abgelehnten Schaltung.
  Einzelheiten: Mehrere Übungen prüften eine einzige Musterlösung, obwohl der Text mehr erlaubt:
  `eine` Lampe lehnte einen Schalter ab, `reihe` und `parallel` ebenso; `rs-reihenfolge` (ordering) verlangte eine feste Reihenfolge von
  Schalter und Lampen, obwohl sie egal ist; die Tabelle ordnete die Glühlampe der Lichtwirkung zu, die Frage `wk-gluehlampe` der
  Wärmewirkung. Behoben: Prüfung auf Verhalten umgestellt, `rs-reihenfolge` durch eine Wahr-oder-falsch-Aussage ersetzt, Tabelle und Zuordnung
  vereinheitlicht, Test mit gleichwertigen Aufbauten je Bauziel, Regel „Eindeutigkeit der Prüfung“ im Inhaltsleitfaden. Das Skill
  `lernapps-exercise-patterns` sollte die Frage „Welche anderen Antworten erlaubt der Text?“ vor jedem Muster stellen, und die Prüfung der
  App sollte Übungen mit mehreren gleichwertigen Antworten melden können (z. B. `ordering` über austauschbaren Bauteilen).
- **Template:** Unter jeder Quizübung steht ein aufklappbares „Lösung“ schon vor der Antwort, und `generated`-Aufgaben zeigen vorab drei
  Beispielaufgaben mit „Tipp“ und „Lösung“. Das ist didaktisch ungünstig und aus dem Inhalt nicht zu ändern; es gehört als Issue zu
  `lernapps/app-templates` (Text: Lösungen erst nach dem Beantworten zeigen, ohne JavaScript dürfen sie bleiben).
- **Template:** `defineOptions({ nojs: "caption" })` lässt den `nojs`-Text als lange Beschreibung unter der Übung stehen, auch mit
  JavaScript. Ohne die Option ersetzt die laufende Komponente ihn. Das steht im Skill als Möglichkeit, nicht als Vorsicht.
- **Template:** Weiterleitungen gibt es nicht. Eine entfernte Seite gibt 404, und ein Katalogeintrag mit ihrem Themenpfad bricht; der
  Eintrag muss im selben Zug geändert werden.
- **Ablauf:** Vor dem Bauen einer Interaktion ein Bild oder einen Ablauf zeigen (Bauen, einschalten, prüfen; was man sieht). Ein Rechner mit Kästchen und
  Texteingabe ist keine Visualisierung.
