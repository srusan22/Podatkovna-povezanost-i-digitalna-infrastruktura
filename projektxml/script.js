document.addEventListener("DOMContentLoaded", function () {
    ucitajXMLPodatke();
    ucitajJSONPodatke();
});

// globalna varijabla za potrebe pretrage XML-a
let xmlDokument = null;

// 1. UČITAVANJE I PARSIRANJE XML-A
function ucitajXMLPodatke() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            xmlDokument = this.responseXML;
            prikaziXML(xmlDokument);
        }
    };
    xhttp.open("GET", "jdm_autofili.xml", true);
    xhttp.send();
}

function prikaziXML(xml) {
    const kontejner = document.getElementById("xml-kontejner");
    kontejner.innerHTML = ""; // Očisti kontejner
    
    const automobili = xml.getElementsByTagName("automobil");
    
    for (let i = 0; i < automobili.length; i++) {
        const marka = automobili[i].getElementsByTagName("marka")[0].textContent;
        const model = automobili[i].getElementsByTagName("model")[0].textContent;
        const godina = automobili[i].getElementsByTagName("godina")[0].textContent;
        const motor = automobili[i].getElementsByTagName("motor")[0].textContent;
        const konja = automobili[i].getElementsByTagName("konja")[0].textContent;
        const opis = automobili[i].getElementsByTagName("opis")[0].textContent;

        const kartica = `
            <div class="card">
                <h3>${marka} ${model}</h3>
                <div class="meta">Godište: ${godina} | Motor: ${motor} (${konja} HP)</div>
                <p>${opis}</p>
            </div>
        `;
        kontejner.innerHTML += kartica;
    }
}

// Funkcija za pretragu XML podataka uživo (Live Search)
function filtrirajXML() {
    const unos = document.getElementById("xmlSearch").value.toLowerCase();
    const automobili = xmlDokument.getElementsByTagName("automobil");
    
    // Kreiramo privremeni XML s filtriranim podacima kako bismo dokazali manipulaciju XML DOM-om
    const noviKontejner = document.getElementById("xml-kontejner");
    noviKontejner.innerHTML = "";

    for (let i = 0; i < automobili.length; i++) {
        const marka = automobili[i].getElementsByTagName("marka")[0].textContent.toLowerCase();
        const model = automobili[i].getElementsByTagName("model")[0].textContent.toLowerCase();
        
        if (marka.includes(unos) || model.includes(unos)) {
            const godina = automobili[i].getElementsByTagName("godina")[0].textContent;
            const motor = automobili[i].getElementsByTagName("motor")[0].textContent;
            const konja = automobili[i].getElementsByTagName("konja")[0].textContent;
            const opis = automobili[i].getElementsByTagName("opis")[0].textContent;

            noviKontejner.innerHTML += `
                <div class="card">
                    <h3>${automobili[i].getElementsByTagName("marka")[0].textContent} ${automobili[i].getElementsByTagName("model")[0].textContent}</h3>
                    <div class="meta">Godište: ${godina} | Motor: ${motor}</div>
                    <p>${opis}</p>
                </div>
            `;
        }
    }
}

// 2. UČITAVANJE I PARSIRANJE JSON-A
function ucitajJSONPodatke() {
    fetch("tuning_stilovi.json")
        .then(response => response.json())
        .then(podaci => {
            prikaziJSON(podaci);
        })
        .catch(greška => console.error("Greška pri učitavanju JSON-a:", greška));
}

function prikaziJSON(stilovi) {
    const kontejner = document.getElementById("json-kontejner");
    
    stilovi.forEach(stil => {
        const kartica = `
            <div class="card" style="border-top-color: #ffcc00;">
                <h3>Stil: ${stil.naziv}</h3>
                <div class="meta" style="color: #ffcc00;">Podrijetlo: ${stil.podrijetlo}</div>
                <p><strong>Karakteristike:</strong> ${stil.karakteristika}</p>
                <p style="margin-top:10px; font-size:13px; color:#888;">Popularno na: ${stil.popularni_modeli}</p>
            </div>
        `;
        kontejner.innerHTML += kartica;
    });
}

// 3. OBRADA FORME I GENERIRANJE STRUKTURA (XML / JSON) NA EKRANU
function obradiFormu(event) {
    event.preventDefault();
    
    const ime = document.getElementById("ime").value;
    const auto = document.getElementById("auto").value;
    const format = document.getElementById("format").value;
    const poruka = document.getElementById("poruka").value;
    
    const prikazBlok = document.getElementById("rezultat-kod");
    const ispisKoda = document.getElementById("kod-ispis");
    
    prikazBlok.style.display = "block";
    
    if (format === "JSON") {
        // Generiraj čisti JSON objekt string
        const noviObjekt = {
            vlasnik: ime,
            automobil: auto,
            napomena: poruka,
            datum_prijave: new Date().toLocaleDateString()
        };
        ispisKoda.textContent = JSON.stringify(noviObjekt, null, 2);
    } else {
        // Generiraj čisti XML string
        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<nova_prijava>\n  <vlasnik>${ime}</vlasnik>\n  <automobil>${auto}</automobil>\n  <napomena>${poruka}</napomena>\n</nova_prijava>`;
        ispisKoda.textContent = xmlString;
    }
}
