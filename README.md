# Kati Sandström – portfolio

Färdig statisk portfolio för GitHub Pages. Sidan är byggd för att kunna uppdateras utan kod via **Pages CMS**.

## Publicera gratis på GitHub Pages

1. Skapa ett GitHub-konto för Kati om hon inte redan har ett.
2. Skapa ett **publikt** repository. Snyggast adress får ni om repositoryt heter exakt `ANVÄNDARNAMN.github.io`.
3. Ladda upp alla filer och mappar i den här portfoliomappen till repositoryts rot.
4. På GitHub: öppna **Settings → Pages** och välj publicering från `main`-branchens rot om sidan inte publiceras automatiskt.
5. Efter någon minut finns sidan på `https://ANVÄNDARNAMN.github.io/`.

Det går också att använda ett vanligt repository, t.ex. `portfolio`. Då blir adressen `https://ANVÄNDARNAMN.github.io/portfolio/`.

## Gör uppdateringar utan kod

Använd Pages CMS: `https://app.pagescms.org/`.

1. Logga in med GitHub.
2. Installera Pages CMS GitHub App för repositoryt.
3. Öppna repositoryt i Pages CMS.
4. Välj **Projekt** för att lägga till/ändra projekt eller **Profil & CV** för att ändra texter, erfarenhet och kontaktuppgifter.
5. Tryck **Save**. Ändringen sparas i GitHub och visas på webbplatsen strax efteråt.

### Nytt projekt

- Lägg till projektnamn och kategori.
- Skriv en kort text och en längre beskrivning.
- Ladda upp en eller flera bilder.
- **Första bilden blir omslagsbild.**
- Lägg till nyckelord om du vill.
- Slå på **Stort projektkort** om projektet ska få större plats i galleriet.
- Spara.

## Viktigt om personuppgifter

Den publicerade CV-filen i detta paket är en separat webbversion där gatuadressen har tagits bort. De personliga breven från original-ZIP-filen är **inte** med i webbplatsen.

## Förhandsvisa på datorn

Om någon teknisk person vill förhandsvisa lokalt:

```bash
python3 -m http.server 8000
```

Öppna sedan `http://localhost:8000`.
