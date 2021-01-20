

function selectionItem(item, selectorParemetres, selectorTraductions) {

    // Recuperation des elements
    const divParametres = document.querySelector(selectorParemetres);
    const divTraduction = document.querySelector(selectorTraductions);

    // Nettoyage
    nettoyerDiv(divParametres);

     // Est-ce la traduction des a des paramètres
     if(item.parametres) {
         item.parametres.forEach(param => creerElementParametres(divParametres, divTraduction, item, param));
     }
    
    // Création des traductions
    if(item.traductions) {
        gererTraductions(divTraduction, item);
    }
    
}

/**
 * Nettoyage d'un div
 * @param {*} div
 */
function nettoyerDiv(div) {
    // Récupération du parent
    const parent = div;
    // Nettoyage
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/**
 * Créer la zone de saisie pour un paramètre
 * @param {*} parent L'élément HTML parent
 * @param {*} item l'élément sélectionné
 * @param {*} param Le paramètre en cours de traitement
 */
function creerElementParametres(divParametres, divTraduction, item, param) {
    // Création d'un div
    var div = document.createElement("div");
    div.setAttribute('class', 'col-6');
    // Création de l'élement
    var input = document.createElement("input");
    input.setAttribute('class', 'form-control');
    // Affectation des paramètres
    input.setAttribute('type', param.type);
    input.setAttribute('name', param.cle);
    input.setAttribute('id', param.cle);
    input.setAttribute('value', param.defaut);
    // Ajout d'un event
    input.addEventListener('change', (e) => {
        gererTraductions(divTraduction, item);
    })
    // Label
    var label = document.createElement("label");
    label.innerText = param.libelle;
    // Ajout
    div.appendChild(label);
    div.appendChild(input);
    divParametres.appendChild(div);
}

function gererTraductions(divTraduction, item) {
    // Nettoyage
    nettoyerDiv(divTraduction);

    // Récupération des valeurs des paramètres
    const valeurs = recupererValeurs(item);

    // Pour chaque item de traduction création d'un noeud
    item.traductions.forEach(traduction => {
        const msg = obtenirTraduction(item, valeurs, traduction);
        creerElementsTraduit(divTraduction, traduction.hashtags, msg);
    });
}

/**
 * Retourne tableau contenant les valeurs pour les paramètres
 * @param {*} item 
 */
function recupererValeurs(item) {
    // Init du tableau
    const valeurs = [];
    // Boucle sur les valeurs
    item.parametres.forEach(param => {
        const val = document.querySelector('#' + param.cle).value;
        valeurs[param.cle] = val;
    });
    // Retour
    return valeurs;
}

/**
 * Retourne le message
 */
function obtenirTraduction(item, valeurs, traduction) {

    let text = traduction.traduction;
    
    if(traduction.formula) {
        let formula = traduction.formula;
        item.parametres.forEach(param => {
            formula = formula.replace(param.cle, valeurs[param.cle]);
        });
        const res = eval(formula);

        text = text.replace('[RES]', new Intl.NumberFormat('fr-FR', { style: 'decimal', currency: 'EUR' }).format(res));
    }
    
    return text;
}

/**
 * Créer un élément enfants
 */
function creerElementsTraduit(parent, hashtags, msg) {
    // Création de l'élement
    const row = document.createElement("div");
    row.setAttribute("class", "card");
    row.innerHTML = tempateTraduction(hashtags, msg);
    parent.appendChild(row);

    $('a.share').click(  function(e){ ouvrirNetwork(e);  });
}

//$('a.share').click(function(e){
function ouvrirNetwork(e) {
    e.preventDefault();
    var $link   = $(e.target).parent();
    var href    = $link.attr('href');
    var network = $link.attr('data-network');

    var networks = {
        facebook : { width : 600, height : 300 },
        twitter  : { width : 600, height : 254 }
    };

    var popup = function(network){
        var options = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,';
        window.open(href, '', options+'height='+networks[network].height+',width='+networks[network].width);
    }

    popup(network);
}