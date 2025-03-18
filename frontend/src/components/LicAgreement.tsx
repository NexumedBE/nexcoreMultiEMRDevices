import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface BetaTestAgreementProps {
  userEmail: string;
  onAccept: () => void;
}

const BetaTestAgreement: React.FC<BetaTestAgreementProps> = ({ userEmail, onAccept }) => {
  const [show, setShow] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const today = new Date().toLocaleDateString("en-GB");

  const todayPlus30 = new Date();
  todayPlus30.setDate(todayPlus30.getDate() + 30);
  const today30 = todayPlus30.toLocaleDateString("en-GB");

  const API_BASE_URL = "http://nexcore.nexumed.eu";

  const handleAccept = async () => {
    console.log('userEmail', userEmail);
    if (!accepted) return;
    console.log("5555555555555", `${API_BASE_URL}api/users/email/${userEmail}/acceptLic`)
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/email/${userEmail}/acceptLic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connection": "keep-alive",
        },
        credentials: "include",
      });
  
      const responseData = await response.json();  
      console.log("🔍 Response Data:", responseData);  
  
      if (!response.ok) {
        throw new Error(`Failed to update license agreement status. Server responded with: ${response.status} ${response.statusText}`);
      }
  
      setShow(false);
      onAccept();
    } catch (error) {
      console.error("❌ License agreement update error:", error);
      alert(`Could not update agreement status. Try again. \n${error}`);
    }
  };
  
  
  

  return (
    <Modal show={show} backdrop="static" keyboard={false} className="modalMainCSS" centered>
      <Modal.Header>
        <Modal.Title className="LicTitle">License Overeenkomst</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
      <div className="p-4 border mt-4">
          <p className="licPtagTopLIne">
            Deze License overeenkomst (“Overeenkomst”) wordt aangegaan tussen Nexumed (waarvan de adresgegevens vermeld staan in de voettekst van deze Overeenkomst) en de ondertekenende tester (Tester) vanaf de laatste hieronder ondertekende datum. 
          </p>
          <p className="licPtagTopLIne">
            {today}
          </p>
          <p className="licPtag">
            <strong>1. Licentieverlening:</strong> Licentieverlening. Met inachtneming van de voorwaarden hiervan, verleent Nexumed aan de Tester  voor de hieronder vermelde BETA-testperiode een beperkte, niet-exclusieve, niet-overdraagbare, herroepbare en niet-sublicensieerbare licentie om de informatica-softwareproducten die door Nexumed aan de Tester geleverd en op de computersystemen van de Tester door Nexumed geïnstalleerd worden en bestaat uit broncode (dat betekent het geheel van programma-instructies in hun oorspronkelijke programmeertaal met inbegrip van daarbij behorende documentatie, bedoeld voor uitvoering door een computer, in een zodanige vorm dat een programmeur die beschikt over kennis en ervaring van de gebruikte programmeerwijze en techniek, daarmee  de functionaliteiten van het systeem kan wijzigen hetgeen impliceert dat alles dat noodzakelijk is om de broncode te compileren of om te zetten in objectcode aanwezig is met inbegrip van (maar niet beperkt tot) header files, run-time libraries en andere externe functionaliteit die vereist is voor de omzetting van de broncode in een volledig uitvoerbare versie die de volledige functionaliteit biedt), objectcode (dat betekent de vertaling van de Broncode in een rechtstreeks door een computer leesbare en uitvoerbare (binaire) code), en bijhorende componenten ("Software") uitsluitend te gebruiken in objectcode-indeling  ten behoeve van de interne evaluatie van de Software door de Tester. De Software wordt niet aan Tester verkocht en mag niet in een productieomgevingen worden gebruikt. Tevens zal Tester de Software niet gebruiken voor de verwerking van live- of productiegegevens. Alle intellectuele, industriële en andere (eigendoms-) rechten (de “IP”) op de Software blijven te allen tijde de exclusieve eigendom van Nexumed (en voor zover toepasselijk haar licentiegevers). Niets in deze Overeenkomst kan worden geïnterpreteerd als een overdracht van enige rechten op de Software door Nexumed aan de Tester. 
          </p>
          <p className="licPtag">
            <strong>2. Geen Dienstverlening:</strong> Nexumed is niet verplicht de Tester diensten te verlenen, behalve zoals expliciet vermeld in Artikel 5 van deze Overeenkomst.
          </p>
          <p className="licPtag">
            <strong>3. Beëindiging:</strong> De hieronder verleende licenties en deze Overeenkomst eindigen bij het verstrijken van de BETA-testperiode, welke eindigt op <strong>{today30}</strong>. Bovendien kan elke partij deze Overeenkomst ten allen tijde beëindigen na schriftelijke kennisgeving aan de andere partij en met inachtneming van een opzegtermijn van één (1) kalenderweek. Binnen vijf dagen na beëindiging zal de Tester (i) de Software en alle kopieën daarvan aan Nexumed teruggeven in de door Nexumed verstrekte vorm of (ii) op verzoek van Nexumed de Software en alle kopieën daarvan vernietigen en schriftelijk bevestigen dat deze zijn vernietigd. Artikelen 2 tot en met 10 blijven van kracht na beëindiging van deze Overeenkomst. 
          </p>
          <p className="licPtag">
            <strong>4. Eigendomsrechten; Vertrouwelijkheid; Beperkingen:</strong> Tester erkent dat de Software vertrouwelijke informatie en handelsgeheimen van Nexumed en haar licentiegevers bevat. Tester zal niet: de Software of enig deel daarvan kopiëren (behalve indien strikt noodzakelijk om de Software te gebruiken in overeenstemming met de voorwaarden van artikel 1 van deze Overeenkomst), distribueren, verkopen, in sublicentie geven of anderszins overdragen of beschikbaar stellen aan een derde partij; alle auteursrecht-legenda's, handelsmerken of vertrouwelijkheidskennisgevingen op de Software of Software-uitvoer uit het zicht verwijderen;  de broncode voor de Software wijzigen, aanpassen, vertalen, reverse-engineeren, decompileren of afleiden, of een derde partij autoriseren om een van de voorgaande handelingen uit te voeren. Tester zal alle auteursrechtvermeldingen van Nexumed en zijn licentiegevers en alle andere eigendomsrechtenvermeldingen reproduceren op alle kopieën van de software die Tester op grond hiervan maakt. Tester zal de Software of de daarbij geleverde documentatie niet gebruiken voor enig ander doel dan de interne evaluatie van de Tester en het geven van feedback aan Nexumed, en niet vrijgeven aan derden zonder de voorafgaande schriftelijke toestemming van Nexumed. De Software, de functies, feedback (zoals gedefinieerd in Artikel 9), gerelateerde technische informatie of de resultaten van een prestatie- of functionele evaluatie of test van de Software kwalificeren als  vertrouwelijke informatie (de "Vertrouwelijke Informatie") van Nexumed. Alle IP op de Vertrouwelijke Informatie behoort tot de exclusieve eigendom van Nexumed vanaf de conceptie daarvan. Tester zal alle redelijke inspanningen leveren om de Vertrouwelijke Informatie te beschermen tegen ongeoorloofd gebruik of openbaarmaking en alle redelijke veiligheidsmaatregelen ter bescherming van de geheimhouding van de Vertrouwelijke Informatie nemen. Tester mag Vertrouwelijke Informatie alleen bekendmaken aan zijn werknemers die genoodzaakt zijn om dergelijke informatie te kennen voor de evaluatie van de Software door de Tester. Tester blijft ervoor verantwoordelijk dat voormelde werknemers gebonden zijn aan die gebruiks- en geheimhoudingsbeperkingen die uiteengezet worden in deze Overeenkomst. Tester zal elke schending van deze bepaling onmiddellijk aan Nexumed melden en zal alle middelen aanwenden om eventuele schade of verliezen die Nexumed kan oplopen als gevolg van een dergelijke schending te beperken. De rechten van Tester op de Software zijn beperkt tot de rechten die uitdrukkelijk worden verleend in Artikel 1. Nexumed en haar licentiegevers behouden zich alle rechten en licenties in en op de Software voor, die niet uitdrukkelijk aan Tester zijn verleend. 
          </p>
          <p className="licPtag">
            <strong>5. Levering en Installatie</strong> Nexumed levert de Software en voert de installatie uit op de computersystemen van de Tester conform de schriftelijke afspraken tussen de Testen en Nexumed daaromtrent. Tester is verantwoordelijk voor het onderhoud en het geïnstalleerd houden van de Software. Nexumed kan, maar is niet verplicht om hulp te bieden  die verder gaat dan de initiële installatie bij levering van de Software. 
          </p>
          <p className="licPtag">
            <strong>6. Garantie:</strong> De Software wordt geleverd “as-is” (in de staat waarin het zich bevindt). Nexumed wijst alle andere expliciete of impliciete waarborgen en garanties af, met inbegrip van enige garantie van verkoopbaarheid, geschiktheid voor een bepaald doel of niet-inbreuk maken op enige rechten en alle garanties die voortvloeien uit de handel of het gebruik in de handel van de Software. Nexumed is niet aansprakelijk voor schade ten gevolge van het gebruik van de Software door de Tester of door derden, noch voor schade door het verspreiden van de inhoud van de Software.
          </p>
          <p className="licPtag">
            <strong>7. Waarborgen:</strong>  Tester erkent en stemt ermee in dat: (a) de Software geen officieel product is en door Nexumed niet commercieel is vrijgegeven voor verkoop; (b) de Software werkt mogelijk niet naar behoren, is niet in definitieve vorm of volledig functioneel; (c) de Software kan technische fouten, ontwerpfouten of andere problemen of fouten bevatten; (d) het is misschien niet mogelijk om de Software volledig functioneel te maken; (e) de informatie die met behulp van de Software is verkregen, is mogelijk niet nauwkeurig en komt mogelijk niet nauwkeurig overeen met informatie die uit een database of andere bron is gehaald; (f) het gebruik van de Software kan leiden tot onverwachte resultaten, verlies van gegevens of communicatie, projectvertragingen of andere onvoorspelbare schade of verlies; (g) Nexumed is niet verplicht om een commerciële versie van de Software uit te brengen; en (h) Nexumed heeft het recht om de ontwikkeling van de Software eenzijdig te staken, op elk moment en zonder enige verplichting of aansprakelijkheid jegens Tester. Tester erkent en stemt ermee in dat hij om welke reden dan ook niet op de Software mag vertrouwen. Tester is als enige verantwoordelijk voor het onderhouden en beschermen van alle gegevens en informatie die door de Software worden opgehaald, geëxtraheerd, getransformeerd, geladen, opgeslagen of anderszins verwerkt. Tester is verantwoordelijk voor alle kosten en uitgaven die nodig zijn voor het maken van een back-up en het herstellen van gegevens en of informatie die verloren of beschadigd zijn als gevolg van het gebruik van de Software door Tester. 
          </p>
          <p className="licPtag">
            <strong>8. Beperking van aansprakelijkheid:</strong> De aansprakelijkheid van Nexumed is beperkt tot de maximale omvang die wettelijk is toegestaan, behalve in geval van grove nalatigheid, opzet of verzuim om haar essentiële verplichtingen onder de Overeenkomst na te komen. De aansprakelijkheid van Nexumed is in elk geval beperkt tot een forfaitair bedrag van 10.000 EUR. Deze aansprakelijkheidsbeperking geldt ongeacht of het handelen, nalaten of de nalatigheid te wijten is aan Nexumed zelf of aan zijn personeel of onderaannemers, en ongeacht het toepasselijke aansprakelijkheidsregime, met inbegrip van, maar niet beperkt tot contractuele aansprakelijkheid, aansprakelijkheid uit onrechtmatige daad, strafrechtelijke aansprakelijkheid of objectieve aansprakelijkheid. Nexumed kan niet aansprakelijk worden gesteld voor enige indirecte schade of gevolgschade, met inbegrip van maar niet beperkt tot winstderving, verlies van goodwill, verlies van gegevens of enige schade die voortvloeit uit of veroorzaakt wordt door het verlies, de onderbreking of de beschadiging van gegevens, inkomstenderving, omzetverlies, verlies van klanten, reputatieschade, verlies van kansen, bedrijfsonderbrekingen of verlies van verwachte besparingen. 
          </p>
          <p className="licPtag">
            <strong>9. Feedback:</strong> Tester zal Nexumed alle redelijke feedback geven over de kenmerken en functionaliteit van de Software. Als Tester feedback geeft aan Nexumed, zal al deze feedback de exclusieve eigendom zijn van Nexumed vanaf de conceptie daarvan. Tester draagt hierbij onherroepelijk alle rechten, titels en belangen van Tester in en op alle feedback over aan Nexumed, inclusief IP op de feedback over aan Nexumed. Tester zal geen rechten of licenties op de Software of op enige IP rechten van Nexumed verdienen of verwerven op grond van deze Overeenkomst of de prestaties van Tester onder deze Overeenkomst, zelfs als Nexumed enige feedback in de Software opneemt.
          </p>
          <p className="licPtag">
            <strong>10. Algemeen:</strong> Tester mag zijn rechten onder deze Overeenkomst niet van rechtswege of anderszins overdragen zonder de voorafgaande schriftelijke toestemming van Nexumed en elke poging tot overdracht zonder dergelijke toestemming zal nietig en zonder effect zijn. Deze Overeenkomst vormt de volledige overeenkomst tussen de partijen en vervangt alle eerdere overeenkomsten, mededelingen en afspraken met betrekking tot de evaluatie van de Software en zal worden geïnterpreteerd in overeenstemming met Belgisch recht. Elke juridische actie of procedure die voortvloeit uit deze Overeenkomst zal uitsluitend worden voorgelegd aan de bevoegde rechtbank in Hasselt. Als een bepaling van deze Overeenkomst ongeldig of niet-afdwingbaar wordt verklaard door een bevoegde rechtbank, zal een dergelijke bepaling zo worden geïnterpreteerd dat deze afdwingbaar is voor zover maximaal toegestaan door de wet, en blijven de overige bepalingen van de Overeenkomst volledig van kracht. Het afstand doen van een recht of gedogen van enige inbreuk of enig verzuim vormt geen afstand van enig ander recht of een gedogen van enige daaropvolgende of eerdere inbreuk of verzuim. Alle kennisgevingen die krachtens deze Overeenkomst vereist of toegestaan zijn en schriftelijk worden gedaan, persoonlijk worden afgeleverd, per aangetekende post, of aantoonbare nachtelijke bezorgservice worden in elk geval geacht te zijn gegeven bij ontvangst. Alle communicatie wordt verzonden naar het respectievelijke onderstaande adres van Tester of het adres van Nexumed of per e-mail. 
          </p>
        </div>
        <div className="center_wanted">
          <Form.Group controlId="acceptAgreement" className="licCheckbox">
            <Form.Check
              type="checkbox"
              label="Ik ga akkoord met de BETA TEST overeenkomst"
              onChange={(e) => setAccepted(e.target.checked)}
            />
          </Form.Group>
        </div>
        <Modal.Footer className="center_wanted">
          <Button 
            variant="secondary" 
            className="subButtonLic" 
            onClick={() => setShow(false)}>
              Annuleren
          </Button>
          <Button
            variant="danger"
            className="subButtonLic"
            onClick={handleAccept}
            disabled={!accepted}
          >
            Accepteren
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default BetaTestAgreement;

