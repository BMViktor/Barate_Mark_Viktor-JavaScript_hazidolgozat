// ============================================================
// DOLGOZAT – Feladatkezelő Alkalmazás
// ============================================================

const alkalmazas = {
    cim: 'Feladatkezelő',
    verzio: 1,
    maxFeladat: 10 
};

const feladatok = [
    { nev: 'Bevásárlás', prioritas: 'magas',    elvegzett: false },
    { nev: 'Edzés',      prioritas: 'alacsony', elvegzett: false },
    { nev: 'Olvasás',    prioritas: 'kozepes',  elvegzett: true  },
    { nev: 'Főzés',      prioritas: 'magas',    elvegzett: false },
    { nev: 'Takarítás',  prioritas: 'alacsony', elvegzett: true  },
    { nev: 'Baraté Márk Viktornak 5-öst adni', prioritas: 'magas', elvegzett: false }
];

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------------------------
    // FEJLÉC + SZÁMLÁLÓ
    // ------------------------------------------------------------
    function fejlecLetrehoz(szoveg) {
        const h1 = document.createElement("h1");
        h1.textContent = szoveg;
        return h1;
    }

    const fejlec = fejlecLetrehoz(alkalmazas.cim);
    document.body.appendChild(fejlec);

    const szamlalo = document.createElement("p");
    document.body.appendChild(szamlalo);

    function szamlaloFrissit() {
        let db = 0;
        for (let i = 0; i < feladatok.length; i++) {
            if (feladatok[i].elvegzett) db++;
        }
        szamlalo.textContent = `Elvégezve: ${db} / ${feladatok.length}`;
    }
    szamlaloFrissit();


    // ------------------------------------------------------------
    // SZŰRŐ GOMBOK
    // ------------------------------------------------------------
    const mindGomb = document.createElement("button");
    mindGomb.textContent = "Mind";

    const elvegzettGomb = document.createElement("button");
    elvegzettGomb.textContent = "Elvégzett";

    const aktivGomb = document.createElement("button");
    aktivGomb.textContent = "Aktív";

    document.body.prepend(aktivGomb);
    document.body.prepend(elvegzettGomb);
    document.body.prepend(mindGomb);


    // ------------------------------------------------------------
    // ÚJ FELADAT BEVITELI SOR
    // ------------------------------------------------------------
    const ujFeladatSor = document.createElement("div");
    ujFeladatSor.classList.add("uj-feladat");

    const ujFeladatInput = document.createElement("input");
    ujFeladatInput.id = "ujFeladatInput";
    ujFeladatInput.placeholder = "Új teendő...";

    const prioritasValaszto = document.createElement("select");
    prioritasValaszto.id = "prioritasValaszto";

    ["magas", "kozepes", "alacsony"].forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p.charAt(0).toUpperCase() + p.slice(1);
        if (p === "kozepes") opt.selected = true;
        prioritasValaszto.appendChild(opt);
    });

    // PRIORITÁS SZÍNEZÉSE
    function prioritasSzinez() {
        prioritasValaszto.classList.remove("mag", "koz", "alac");

        if (prioritasValaszto.value === "magas") prioritasValaszto.classList.add("mag");
        if (prioritasValaszto.value === "kozepes") prioritasValaszto.classList.add("koz");
        if (prioritasValaszto.value === "alacsony") prioritasValaszto.classList.add("alac");
    }
    prioritasValaszto.addEventListener("change", prioritasSzinez);
    prioritasSzinez();

    const ujFeladatGomb = document.createElement("button");
    ujFeladatGomb.id = "ujFeladatGomb";
    ujFeladatGomb.textContent = "Hozzáadás";

    ujFeladatSor.append(ujFeladatInput, prioritasValaszto, ujFeladatGomb);
    document.body.appendChild(ujFeladatSor);


    // ------------------------------------------------------------
    // KÁRTYÁK KONTÉNER
    // ------------------------------------------------------------
    const container = document.createElement("div");
    container.classList.add("kartyak-container");
    document.body.appendChild(container);


    // ------------------------------------------------------------
    // KÁRTYA LÉTREHOZÓ FÜGGVÉNY
    // ------------------------------------------------------------
    function kartyaLetrehoz({ nev, prioritas, elvegzett }) {
        const div = document.createElement("div");
        div.classList.add("kartya", prioritas);
        if (elvegzett) div.classList.add("elvegzett");

        const p = document.createElement("p");
        p.textContent = nev;

        const span = document.createElement("span");
        span.textContent = `⚡ ${prioritas}`;

        const keszGomb = document.createElement("button");
        keszGomb.textContent = elvegzett ? "Visszavonás" : "Kész";

        keszGomb.addEventListener("click", function () {
            const index = feladatok.findIndex(f => f.nev === nev);

            if (keszGomb.textContent === "Kész") {
                div.classList.add("elvegzett");
                keszGomb.textContent = "Visszavonás";
                feladatok[index].elvegzett = true;
            } else {
                div.classList.remove("elvegzett");
                keszGomb.textContent = "Kész";
                feladatok[index].elvegzett = false;
            }

            szamlaloFrissit();
        });

        const torlesGomb = document.createElement("button");
        torlesGomb.textContent = "Törlés";

        torlesGomb.addEventListener("click", function () {
            div.remove();
            const index = feladatok.findIndex(f => f.nev === nev);
            feladatok.splice(index, 1);
            szamlaloFrissit();
        });

        div.append(p, span, keszGomb, torlesGomb);
        return div;
    }


    // ------------------------------------------------------------
    // KÁRTYÁK KIÍRÁSA
    // ------------------------------------------------------------
    function kartyakRender() {
        container.innerHTML = "";
        for (let i = 0; i < feladatok.length; i++) {
            container.appendChild(kartyaLetrehoz(feladatok[i]));
        }
    }
    kartyakRender();


    // ------------------------------------------------------------
    // ÚJ FELADAT HOZZÁADÁSA (MAX 10 FELADAT)
    // ------------------------------------------------------------
    function ujFeladatHozzaad() {
        const nev = ujFeladatInput.value.trim();
        const prioritas = prioritasValaszto.value;

        if (nev === "") {
            alert("Adj meg egy feladatot!");
            return;
        }

        // MAXIMUM 10 FELADAT
        if (feladatok.length >= alkalmazas.maxFeladat) {
            alert("Elérted a maximum 10 feladatot!");
            return;
        }

        const uj = {
            nev: nev,
            prioritas: prioritas,
            elvegzett: false
        };

        feladatok.push(uj);
        container.appendChild(kartyaLetrehoz(uj));

        ujFeladatInput.value = "";
        szamlaloFrissit();
    }

    ujFeladatGomb.addEventListener("click", ujFeladatHozzaad);

    // ENTERREL IS HOZZÁAD
    ujFeladatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") ujFeladatHozzaad();
    });


    // ------------------------------------------------------------
    // SZŰRÉS
    // ------------------------------------------------------------
    mindGomb.addEventListener("click", () => {
        document.querySelectorAll(".kartya").forEach(k => k.style.display = "flex");
    });

    elvegzettGomb.addEventListener("click", () => {
        document.querySelectorAll(".kartya").forEach(k =>
            k.style.display = k.classList.contains("elvegzett") ? "flex" : "none"
        );
    });

    aktivGomb.addEventListener("click", () => {
        document.querySelectorAll(".kartya").forEach(k =>
            k.style.display = !k.classList.contains("elvegzett") ? "flex" : "none"
        );
    });


    // ------------------------------------------------------------
    // RENDEZÉS
    // ------------------------------------------------------------
    function rendez(tomb) {
        const sorrend = { magas: 1, kozepes: 2, alacsony: 3 };

        for (let i = 0; i < tomb.length - 1; i++) {
            for (let j = 0; j < tomb.length - 1; j++) {
                if (sorrend[tomb[j].prioritas] > sorrend[tomb[j + 1].prioritas]) {
                    const csere = tomb[j];
                    tomb[j] = tomb[j + 1];
                    tomb[j + 1] = csere;
                }
            }
        }
        return tomb;
    }

    const rendezett = rendez([...feladatok]);
    rendezett.forEach(f => console.log(f.nev));

});