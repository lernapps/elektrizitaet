---
# Read by the git hooks, the review and the evals.
# Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json. Keep all three keys.
# archetype: the kind of app, chosen at the end of Explore: explainer, interactive or quiz. null until then.
archetype: explainer
# phase: the phase you work in now: explore, plan, code or commit. Change it when you enter the next phase.
phase: commit
# prePushFailures: failed runs of the pre-push hook. The hook counts them. Never change this value.
prePushFailures: 0
---

# Plan: Elektrizität

*Gestartet am 2026-10-14. Ablauf: Explore, Plan, Code, Commit.*

## Goal

Lernende der Klassen 5 und 6 erklären sich Schritt für Schritt die Grundlagen der Elektrizität (Stromkreis, Leiter und
Nichtleiter, Schaltungen, Wirkungen und Sicherheit) und üben auf jeder Seite; im Bau-Editor bauen sie selbst
Schaltungen. Der Lehrgang soll später um höhere Jahrgänge wachsen.

## Key decisions

- Archetyp `explainer`: viele Seiten mit Erklärung und Übung, auch ohne JavaScript lesbar.
- Jahrgang 5 und 6, Deutschland länderübergreifend (Entscheidung der Auftraggeberin bzw. des Auftraggebers).
- Zweisprachig von Anfang an, Deutsch und Englisch (Wunsch der Auftraggeberin bzw. des Auftraggebers nach der Planbestätigung).
- Der Bau-Editor ist grafisch: ein SVG-Schaltbrett mit sechs festen Plätzen, auf die man Lampe, Schalter oder Kabel setzt
  (Wunsch der Auftraggeberin bzw. des Auftraggebers).
- Bilder ohne Wörter, nur mit Ziffern, Legende in der Bildunterschrift, weil `labelled-figure` ohne JavaScript nicht prüfbar
  war (guess).
- Bau-Editor von Anfang an dabei, als Komponente `SchaltungBauen`: kein Block kann eine Schaltung bauen lassen
  (`prefer-built-in-block`). Er prüft das Verhalten der Schaltung, nicht ihren Aufbau.
- Ohne Lehrplanzitat weitergebaut, weil kein offizielles Lehrplandokument gefunden wurde (Entscheidung der Auftraggeberin
  bzw. des Auftraggebers).
- `@types/node` als devDependency ergänzt, damit `vue-tsc` besteht (guess).
- Selbst gezeichnete Schaltbilder als SVG unter CC0-1.0 statt fremder Bilder (guess).

## Notes

- Lehrplan: nicht geprüft. Schulinterne Pläne und Unterrichtsmaterial nennen übereinstimmend die Themen Stromkreis, Leiter und
  Nichtleiter, Schalter und Schaltpläne, Reihen- und Parallelschaltung, Wirkungen des Stroms, Sicherheit.
- Quellen: die Wikipedia-Artikel aus `src/app.yaml` (geladen). Serlo: nur Übersichtsseite geladen, keine Einzelartikel
  geprüft, nicht verwendet. LeifiPhysik: HTTP 403, nicht geprüft.
- Kompetenzen und Seiten stehen im Inhaltsleitfaden `.agents/skills/app-content/SKILL.md`.
- Offen: Lehrplanzitat nachreichen, sobald ein Land festgelegt ist.

## Explore

### Tasks

### Answers

- Zielgruppe: Klasse 5–6, Deutschland, länderübergreifend.
- Übungen: Schaltung bauen/prüfen, Sortieren/Zuordnen, Quizfragen mit Rückmeldung, Sicherheit im Alltag.
- Der Lehrgang folgt dem Lehrplan, beginnt mit den jüngeren Jahrgängen und soll später wachsen.
- Bau-Editor gleich mit dabei. Ohne Lehrplanzitat weiterbauen. Urheber: Oliver (@mrsimpson).

### Entry draft

```yaml
title: Elektrizität
subject: Physik
grades: [5, 6]
summary: >-
  Du erklärst dir Schritt für Schritt, wie ein Stromkreis funktioniert, welche Stoffe den Strom leiten und wie
  Reihen- und Parallelschaltung sich unterscheiden. Auf jeder Seite übst du, und im Bau-Editor baust du selbst
  Schaltungen.
topics:
  - { title: Der einfache Stromkreis, path: stromkreis/einfacher-stromkreis/ }
  - { title: Leiter und Nichtleiter, path: stromkreis/leiter-nichtleiter/ }
  - { title: Schalter und Schaltzeichen, path: schaltungen/schalter-schaltzeichen/ }
  - { title: Reihenschaltung, path: schaltungen/reihenschaltung/ }
  - { title: Parallelschaltung, path: schaltungen/parallelschaltung/ }
  - { title: Bau-Editor, path: schaltungen/bau-editor/ }
  - { title: Wirkungen des elektrischen Stroms, path: alltag/wirkungen/ }
  - { title: Sicher mit Strom umgehen, path: alltag/sicherheit/ }
keywords: [Stromkreis, Leiter, Nichtleiter, Schalter, Reihenschaltung, Parallelschaltung, Schaltplan, Kurzschluss]
creator:
  name: Oliver
  url: https://github.com/mrsimpson
fitness:
  account: false
  install: false
  storage: none
  thirdParty: none
  checked: false
```

### Completed

- [x] Zweck, Zielgruppe und Herkunft der Inhalte erfragt.
- [x] Inhalte recherchiert; kein Lehrplandokument gefunden, Auftraggeber:in entschied: ohne Zitat weiterbauen.
- [x] Archetyp `explainer` gewählt.
- [x] Checkpoint Recherche: besprochen und bestätigt.

## Plan

### Tasks

### Content method

- Muster Einordnen, Vorhersagen, Beurteilen: Quiz-Fragetypen des Explainers, je Seite drei Stück, mit wahrer `info` je Option.
- Muster Bauen: Komponente `SchaltungBauen`, sechs Aufgaben; sie kann nur Reihe und Parallelzweige mit Lampen und
  Schaltern simulieren, keine Spannung oder Helligkeit.
- Figuren: eigene SVG-Zeichnungen in `src/images/`; keine Datendateien in der ersten Version.
- Eine neue Seite folgt dem Leitfaden `app-content`, Abschnitt „Adding a chapter or round“.

### Completed

- [x] Aufgaben von Code geschrieben (acht Seiten in drei Kapiteln, Bau-Editor).
- [x] Inhaltsmethode beschrieben.
- [x] Checkpoint Plan: von der Auftraggeberin bzw. dem Auftraggeber bestätigt.

## Code

### Tasks

- [x] Generator, Branch `work`, `npm install`, erster Commit.
- [x] Skills `lernapps-app` und `lernapps-explainer` gelesen.
- [x] Inhaltsleitfaden ausgefüllt.
- [x] Kapitel `stromkreis`: zwei Seiten.
- [x] Kapitel `schaltungen`: vier Seiten mit Bau-Editor `SchaltungBauen`.
- [x] Kapitel `alltag`: zwei Seiten.
- [x] `npx lernapps check` besteht.
- [x] `phase: commit` gesetzt.

### Completed

## Commit

### Tasks

- [x] Branch `work` pushen.
- [x] Repo-Einstellungen prüfen (Standardbranch, Pages).
- [x] **Checkpoint:** Veröffentlichung.
- [x] `main` anlegen und pushen, Lauf `Pages` beobachten.
- [x] Standardbranch auf `main`.
- [x] Adresse öffnen.
- [x] Skill `lernapps-listing` laden, Eintrag vervollständigen.
- [x] **Checkpoint:** Listing.
- [x] Retrospektive ausfüllen, Plan auf `main` pushen.
- [ ] Listing-Pull-Request öffnen.

### Completed

## Retrospective

### Phases reached

Commit; bestätigt, veröffentlicht (https://lernapps.net/elektrizitaet/), Listing bestätigt. Der Listing-Pull-Request ist offen.

### Failed checks

- `checks-pass`: 2 (Format; `vue-tsc` ohne `@types/node`).
- `explainer-content-valid`: 1 (Link zwischen Seiten, Seite ohne Quiz-Übung, Kommas in Flow-Listen).
- `checks-pass` (Ende-zu-Ende-Test ohne JavaScript): 1, weil `labelled-figure` sein Bild ohne JavaScript versteckt.

### Creator turns after the plan

4 (Lehrplan und Urheber; Wunsch nach Deutsch/Englisch und grafischem Editor; Veröffentlichung bestätigt; Listing bestätigt). Davon 2 Wünsche nach dem Plan: Antwort zum Lehrplan (ohne Zitat weiterbauen) und Name des Urhebers; danach der Wunsch nach Deutsch und Englisch
und nach einem grafischen Editor mit Plätzen.

### Where I had to guess

- `@types/node` ergänzt, weil `vue-tsc` sonst an Dateien aus `node_modules` scheitert (Fehler der Vorlage?).
- Schaltbilder selbst gezeichnet; Lizenz CC0-1.0.
- Lehrplan nicht zitiert, weil kein offizielles Dokument gefunden wurde.
- Englische Fassung der Fragen verlinkt auf deutsche Wikipedia-Artikel (die Linkadresse hat keine Sprachvariante).
- Parallelschaltung: Mein erstes Schaltbild hatte eine Querleitung, die beide Lampen kurzgeschlossen hätte; behoben.
