(() => {
  "use strict";

  const storageKey = "akra-demo-data-v1";
  const modules = [
    ["index", "Tableau de bord"],
    ["fournisseurs", "Fournisseurs"],
    ["receptions", "Réceptions"],
    ["lots", "Lots et hygiène"],
    ["stocks", "Stocks"],
    ["clients", "Clients"],
    ["commandes", "Commandes et livraisons"],
    ["tresorerie", "Trésorerie"],
    ["microfinance", "Microfinance"],
    ["utilisateurs", "Utilisateurs"],
    ["audit", "Journal d'audit"]
  ];
  const seed = {
    fournisseurs: [
      { id: 1, nom: "Aminata K.", telephone: "+243 000 000 101", statut: "Actif", receptions: 3, reste: 12500 },
      { id: 2, nom: "Coopérative des Mamans", telephone: "+243 000 000 202", statut: "Actif", receptions: 2, reste: 0 },
      { id: 3, nom: "Mado B.", telephone: "+243 000 000 303", statut: "Inactif", receptions: 1, reste: 8000 }
    ],
    clients: [
      { id: 1, nom: "Restaurant La Savane", type: "Restaurant", telephone: "+243 000 000 410", adresse: "Centre-ville" },
      { id: 2, nom: "Famille Mbuyi", type: "Ménage", telephone: "+243 000 000 520", adresse: "Quartier Nord" },
      { id: 3, nom: "Marché Central", type: "Marché", telephone: "+243 000 000 630", adresse: "Avenue du Marché" }
    ],
    lots: [
      { id: 1, code: "L-DEMO-001", produit: "Tomates", initial: 80, stock: 42, statut: "Validé", lavage: "Exemple - non validé", dosage: "Exemple" },
      { id: 2, code: "L-DEMO-002", produit: "Amarante", initial: 55, stock: 55, statut: "En contrôle", lavage: "", dosage: "" },
      { id: 3, code: "L-DEMO-003", produit: "Gombo", initial: 45, stock: 0, statut: "Rejeté", lavage: "", dosage: "" }
    ],
    receptions: [
      { id: 1, date: "2026-10-10", fournisseur: "Aminata K.", produit: "Tomates", quantite: 80, prix: 500, montant: 40000, paye: 27500, lot: "L-DEMO-001" },
      { id: 2, date: "2026-10-11", fournisseur: "Coopérative des Mamans", produit: "Amarante", quantite: 55, prix: 450, montant: 24750, paye: 24750, lot: "L-DEMO-002" }
    ],
    commandes: [
      { id: 1, date: "2026-10-12", client: "Restaurant La Savane", produit: "Tomates", quantite: 18, statut: "À préparer" },
      { id: 2, date: "2026-10-13", client: "Famille Mbuyi", produit: "Amarante", quantite: 12, statut: "En livraison" }
    ],
    transactions: [
      { id: 1, date: "2026-10-12", type: "Recette", libelle: "Vente de légumes (exemple)", fonds: "Exploitation", montant: 36000, reference: "DEMO-001", corrigee: false },
      { id: 2, date: "2026-10-12", type: "Dépense", libelle: "Transport (exemple)", fonds: "Exploitation", montant: 8500, reference: "DEMO-002", corrigee: false },
      { id: 3, date: "2026-10-13", type: "Dépense", libelle: "Paiement fournisseur (exemple)", fonds: "Exploitation", montant: 12000, reference: "DEMO-003", corrigee: false }
    ],
    utilisateurs: [
      { nom: "Compte de démonstration", email: "non-configure@example.invalid", role: "Visiteur", statut: "Démonstration uniquement" }
    ],
    audit: [
      { date: "2026-10-13 09:00", utilisateur: "Démo locale", action: "Ouverture de la démonstration", details: "Aucune authentification ni journal serveur" }
    ]
  };
  const formFields = {
    fournisseurs: [
      { name: "nom", label: "Nom", required: true },
      { name: "telephone", label: "Téléphone", type: "tel" }
    ],
    clients: [
      { name: "nom", label: "Nom", required: true },
      { name: "type", label: "Type", options: ["Ménage", "Commerçant", "Restaurant", "Marché"] },
      { name: "telephone", label: "Téléphone", type: "tel" },
      { name: "adresse", label: "Adresse" }
    ],
    receptions: [
      { name: "date", label: "Date", type: "date", required: true, value: new Date().toISOString().slice(0, 10) },
      { name: "fournisseur", label: "Fournisseur", optionsFrom: "fournisseurs", required: true },
      { name: "produit", label: "Légume", options: ["Tomates", "Amarante", "Gombo", "Chou"] },
      { name: "quantite", label: "Quantité (bottes)", type: "number", min: 1, value: 50, required: true },
      { name: "prix", label: "Prix convenu (FC/botte)", type: "number", min: 1, value: 500, required: true },
      { name: "observations", label: "Observations" }
    ],
    commandes: [
      { name: "client", label: "Client", optionsFrom: "clients", required: true },
      { name: "produit", label: "Légume", options: ["Tomates", "Amarante", "Gombo", "Chou"] },
      { name: "quantite", label: "Quantité (bottes)", type: "number", min: 1, value: 1, required: true }
    ],
    tresorerie: [
      { name: "type", label: "Type", options: ["Dépense", "Recette"] },
      { name: "libelle", label: "Libellé", required: true },
      { name: "montant", label: "Montant (FC)", type: "number", min: 1, required: true },
      { name: "fonds", label: "Fonds", options: ["Exploitation", "Santé", "Solidarité", "Microfinance"] },
      { name: "reference", label: "Pièce justificative (n°)" }
    ]
  };
  const tableColumns = {
    fournisseurs: [["Nom", "nom"], ["Téléphone", "telephone"], ["Statut", "statut"], ["Réceptions", "receptions"], ["Reste à payer", "reste", "money"]],
    clients: [["Nom", "nom"], ["Type", "type"], ["Téléphone", "telephone"], ["Adresse", "adresse"]],
    receptions: [["Date", "date"], ["Fournisseur", "fournisseur"], ["Légume", "produit"], ["Qté", "quantite"], ["Prix", "prix", "money"], ["Montant dû", "montant", "money"], ["Payé", "paye", "money"], ["Lot", "lot"]],
    stocks: [["Légume", "produit"], ["Stock vendable", "vendable"], ["En contrôle (non vendable)", "controle"], ["Alerte", "alerte"]],
    commandes: [["Date", "date"], ["Client", "client"], ["Légume", "produit"], ["Qté", "quantite"], ["Statut", "statut"]],
    tresorerie: [["Date", "date"], ["Type", "type"], ["Libellé", "libelle"], ["Fonds", "fonds"], ["Montant", "montant", "money"], ["Pièce", "reference"]],
    utilisateurs: [["Nom", "nom"], ["E-mail fictif", "email"], ["Rôle", "role"], ["Statut", "statut"]],
    audit: [["Date", "date"], ["Utilisateur", "utilisateur"], ["Action", "action"], ["Détails", "details"]]
  };

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const money = value => `${Number(value || 0).toLocaleString("fr-FR")} FC`;
  const dateNow = () => new Date().toISOString().slice(0, 10);
  let data;

  function loadData() {
    try {
      const saved = localStorage.getItem(storageKey);
      data = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(seed));
      if (!data || typeof data !== "object" || Object.keys(seed).some(key => !Array.isArray(data[key]))) {
        throw new Error("Données locales invalides.");
      }
      if (!saved) saveData();
    } catch (error) {
      throw new Error(`Impossible de lire les données de démonstration dans ce navigateur. ${error.message}`);
    }
  }

  function saveData() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      throw new Error(`Les données de démonstration n'ont pas pu être enregistrées. ${error.message}`);
    }
  }

  function logAction(action, details) {
    data.audit.unshift({
      date: new Date().toLocaleString("fr-FR"),
      utilisateur: "Démo locale",
      action,
      details
    });
  }

  function nextId(rows) {
    return rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
  }

  function fieldMarkup(field) {
    const options = field.optionsFrom
      ? data[field.optionsFrom].map(row => row.nom)
      : field.options;
    let input;
    if (options) {
      input = `<select name="${escapeHtml(field.name)}" ${field.required ? "required" : ""}>${options.map(option => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select>`;
    } else {
      input = `<input name="${escapeHtml(field.name)}" type="${field.type || "text"}" ${field.min ? `min="${field.min}"` : ""} ${field.value !== undefined ? `value="${escapeHtml(field.value)}"` : ""} ${field.required ? "required" : ""}>`;
    }
    return `<div><label>${escapeHtml(field.label)}</label>${input}</div>`;
  }

  function formMarkup(module) {
    const fields = formFields[module];
    if (!fields) return "";
    const title = module === "tresorerie" ? "Nouvelle opération (fictive)" : `Ajouter ${module === "clients" ? "un client" : module === "fournisseurs" ? "un fournisseur" : module === "receptions" ? "une réception" : "une commande"} (démo)`;
    return `<form class="f card" id="demo-form"><h2 style="width:100%">${title}</h2>${fields.map(fieldMarkup).join("")}<button class="btn">Enregistrer dans cette démo</button></form>`;
  }

  function tableMarkup(columns, rows, module) {
    const headers = columns.map(column => `<th>${escapeHtml(column[0])}</th>`).join("");
    const actionHeader = ["fournisseurs", "receptions", "commandes", "tresorerie"].includes(module) ? "<th>Action démo</th>" : "";
    const body = rows.length ? rows.map(row => {
      const cells = columns.map(([, key, format]) => `<td>${escapeHtml(format === "money" ? money(row[key]) : row[key])}</td>`).join("");
      return `<tr>${cells}${actionCell(module, row)}</tr>`;
    }).join("") : `<tr><td colspan="${columns.length + (actionHeader ? 1 : 0)}">Aucune donnée.</td></tr>`;
    return `<div class="card w"><table><thead><tr>${headers}${actionHeader}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function actionCell(module, row) {
    if (module === "fournisseurs") return `<td><button class="btn s gh" data-action="toggle-supplier" data-id="${row.id}">${row.statut === "Actif" ? "Désactiver" : "Activer"}</button></td>`;
    if (module === "receptions") {
      const reste = row.montant - row.paye;
      return `<td>${reste > 0 ? `<button class="btn s" data-action="pay-receipt" data-id="${row.id}">Payer ${money(reste)}</button>` : '<span class="badge ok">Soldé</span>'}</td>`;
    }
    if (module === "commandes") return `<td><button class="btn s gh" data-action="advance-order" data-id="${row.id}">Changer le statut</button></td>`;
    if (module === "tresorerie") return `<td>${row.corrigee ? '<span class="badge wa">Corrigée</span>' : `<button class="btn s gh" data-action="reverse-transaction" data-id="${row.id}">Créer une extourne démo</button>`}</td>`;
    return "";
  }

  function kpis(items) {
    return `<div class="kpi">${items.map(([value, label]) => `<div class="card"><b>${escapeHtml(value)}</b><span>${escapeHtml(label)}</span></div>`).join("")}</div>`;
  }

  function renderDashboard() {
    const recettes = data.transactions.filter(row => row.type === "Recette" && !row.corrigee).reduce((sum, row) => sum + Number(row.montant), 0);
    const depenses = data.transactions.filter(row => row.type === "Dépense" && !row.corrigee).reduce((sum, row) => sum + Number(row.montant), 0);
    const orders = data.commandes.filter(row => !["Livrée", "Annulée"].includes(row.statut)).length;
    const stock = data.lots.filter(row => row.statut === "Validé").reduce((sum, row) => sum + Number(row.stock), 0);
    const due = data.receptions.reduce((sum, row) => sum + row.montant - row.paye, 0);
    const control = data.lots.filter(row => row.statut === "En contrôle").length;
    return kpis([[money(recettes), "Recettes fictives"], [money(depenses), "Dépenses fictives"], [orders, "Commandes à livrer"], [`${stock} bottes`, "Stock vendable démo"], [money(due), "Paiements fournisseurs en attente"], [control, "Lots en contrôle"]]) +
      '<div class="card"><h2>À propos de cette démonstration</h2><p>Les chiffres et opérations présentés sont fictifs. Les modifications restent dans le stockage local de votre navigateur et ne sont visibles que sur cet appareil. Ne saisissez aucune donnée personnelle ou financière réelle.</p></div>';
  }

  function renderTreasury() {
    const active = data.transactions.filter(row => !row.corrigee);
    const income = active.filter(row => row.type === "Recette").reduce((sum, row) => sum + Number(row.montant), 0);
    const expense = active.filter(row => row.type === "Dépense").reduce((sum, row) => sum + Number(row.montant), 0);
    const funds = ["Exploitation", "Santé", "Solidarité", "Microfinance"].map(fund => {
      const rows = active.filter(row => row.fonds === fund);
      const inTotal = rows.filter(row => row.type === "Recette").reduce((sum, row) => sum + Number(row.montant), 0);
      const outTotal = rows.filter(row => row.type === "Dépense").reduce((sum, row) => sum + Number(row.montant), 0);
      return { fonds: fund, recettes: money(inTotal), depenses: money(outTotal), solde: money(inTotal - outTotal) };
    });
    const fundTable = tableMarkup([["Fonds", "fonds"], ["Recettes", "recettes"], ["Dépenses", "depenses"], ["Solde", "solde"]], funds, "none");
    return kpis([[money(income), "Recettes fictives"], [money(expense), "Dépenses fictives"], [money(income - expense), "Solde fictif"]]) +
      `<div class="card w"><h2>Totaux par fonds (exemple)</h2>${fundTable}</div>`;
  }

  function renderLots() {
    const cards = data.lots.map(row => {
      const statusClass = row.statut === "Validé" ? "ok" : row.statut === "Rejeté" ? "er" : "wa";
      const buttons = row.statut === "En contrôle" ? `<button class="btn s" data-action="validate-lot" data-id="${row.id}">Valider (démo)</button> <button class="btn s dg" data-action="reject-lot" data-id="${row.id}">Rejeter (démo)</button>` : "";
      return `<article class="card"><b>${escapeHtml(row.code)}</b> · ${escapeHtml(row.produit)} · reçu ${row.initial} · stock ${row.stock} <span class="badge ${statusClass}">${escapeHtml(row.statut)}</span><p class="note">Données fictives. Un statut « Validé » ici n'atteste d'aucun contrôle sanitaire réel.</p>${buttons}</article>`;
    }).join("");
    return '<div class="msg err">Démonstration uniquement : les procédures et dosages sanitaires doivent être établis par des personnes compétentes. Ne basez aucune décision réelle sur ces exemples.</div>' + cards;
  }

  function renderStocks() {
    const products = [...new Set(data.lots.map(row => row.produit))];
    const rows = products.map(produit => ({
      produit,
      vendable: data.lots.filter(row => row.produit === produit && row.statut === "Validé").reduce((sum, row) => sum + Number(row.stock), 0),
      controle: data.lots.filter(row => row.produit === produit && row.statut === "En contrôle").reduce((sum, row) => sum + Number(row.stock), 0)
    })).map(row => ({ ...row, alerte: row.vendable < 20 ? "Stock faible (démo)" : "" }));
    return tableMarkup(tableColumns.stocks, rows, "stocks") + '<p class="note">Inventaire fictif : les lots et quantités ne représentent pas un stock réel.</p>';
  }

  function renderModule(module) {
    if (module === "index") return renderDashboard();
    if (module === "microfinance") return '<div class="msg" style="background:var(--wb);color:var(--wa)">Module désactivé. Les règles, contrats et exigences légales doivent être validés avant tout usage réel.</div><div class="card"><h2>Fonctions prévues</h2><p>Demandes de crédit, garanties, suivi des remboursements et gestion des retards sont présentés comme pistes de travail uniquement. Aucune opération de microfinance n’est active dans cette maquette.</p></div>';
    if (module === "lots") return renderLots();
    if (module === "stocks") return renderStocks();
    if (module === "tresorerie") return renderTreasury() + formMarkup(module) + tableMarkup(tableColumns.tresorerie, data.transactions, module);
    return (formMarkup(module) || "") + tableMarkup(tableColumns[module] || [], data[module] || [], module);
  }

  function render() {
    const module = document.body.dataset.module || "index";
    const title = modules.find(([key]) => key === module)?.[1];
    const root = document.getElementById("app-content");
    if (!title || !root) return;
    document.title = `${title} · AKRA (démo)`;
    document.getElementById("page-title").textContent = title;
    document.getElementById("app-nav").innerHTML = modules.map(([key, label]) =>
      `<a href="${key}.html" ${key === module ? 'class="on" aria-current="page"' : ""}>${escapeHtml(label)}</a>`
    ).join("") + '<a href="../index.html" class="ext">← Site public</a><a href="logout.html" class="ext">Quitter la démo</a>';
    root.innerHTML = renderModule(module) + '<p class="note">Les modifications de cette démonstration sont locales et modifiables par toute personne ayant accès à ce navigateur. <button class="btn s gh" data-action="reset-demo">Réinitialiser les exemples</button></p>';
    root.querySelectorAll("form").forEach(form => form.addEventListener("submit", handleSubmit));
    root.onclick = handleAction;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const module = document.body.dataset.module;
    const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
    const id = nextId(data[module] || []);
    if (module === "fournisseurs") {
      data.fournisseurs.unshift({ id, nom: formData.nom.trim(), telephone: formData.telephone.trim(), statut: "Actif", receptions: 0, reste: 0 });
      logAction("Fournisseur ajouté (démo)", formData.nom);
    } else if (module === "clients") {
      data.clients.unshift({ id, ...formData, nom: formData.nom.trim() });
      logAction("Client ajouté (démo)", formData.nom);
    } else if (module === "receptions") {
      const quantity = Number(formData.quantite);
      const unitPrice = Number(formData.prix);
      const lotCode = `L-DEMO-${String(nextId(data.lots)).padStart(3, "0")}`;
      data.receptions.unshift({ id, date: formData.date, fournisseur: formData.fournisseur, produit: formData.produit, quantite: quantity, prix: unitPrice, montant: quantity * unitPrice, paye: 0, lot: lotCode });
      data.lots.unshift({ id: nextId(data.lots), code: lotCode, produit: formData.produit, initial: quantity, stock: quantity, statut: "En contrôle", lavage: "", dosage: "" });
      logAction("Réception créée (démo)", `${lotCode} · ${quantity} bottes`);
    } else if (module === "commandes") {
      data.commandes.unshift({ id, date: dateNow(), ...formData, quantite: Number(formData.quantite), statut: "À préparer" });
      logAction("Commande créée (démo)", formData.client);
    } else if (module === "tresorerie") {
      data.transactions.unshift({ id, date: dateNow(), ...formData, montant: Number(formData.montant), corrigee: false });
      logAction("Opération ajoutée (démo)", `${formData.type} · ${money(formData.montant)}`);
    }
    try {
      saveData();
      render();
    } catch (error) {
      showError(error.message);
    }
  }

  function handleAction(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const row = listForAction(action).find(item => Number(item.id) === id);
    if (action === "reset-demo") {
      try {
        localStorage.removeItem(storageKey);
        loadData();
        render();
      } catch (error) {
        showError(error.message);
      }
      return;
    }
    if (!row) return;
    if (action === "toggle-supplier") {
      row.statut = row.statut === "Actif" ? "Inactif" : "Actif";
      logAction("Statut fournisseur modifié (démo)", row.nom);
    } else if (action === "pay-receipt") {
      const remaining = row.montant - row.paye;
      const payment = Number(window.prompt(`Montant fictif à payer (reste ${money(remaining)})`, String(remaining)));
      if (!Number.isFinite(payment) || payment < 1 || payment > remaining) {
        if (payment) window.alert("Montant invalide pour cette démonstration.");
        return;
      }
      row.paye += payment;
      logAction("Paiement fictif enregistré", `${row.lot} · ${money(payment)}`);
    } else if (action === "advance-order") {
      const statuses = ["À préparer", "En livraison", "Livrée"];
      row.statut = statuses[(statuses.indexOf(row.statut) + 1) % statuses.length];
      logAction("Statut de commande changé (démo)", `Commande #${id} · ${row.statut}`);
    } else if (action === "validate-lot" || action === "reject-lot") {
      if (action === "validate-lot" && !window.confirm("Confirmer le statut fictif ? Ceci ne valide aucun contrôle sanitaire réel.")) return;
      row.statut = action === "validate-lot" ? "Validé" : "Rejeté";
      if (action === "reject-lot") row.stock = 0;
      logAction("Statut de lot modifié (démo)", `${row.code} · ${row.statut}`);
    } else if (action === "reverse-transaction") {
      const reason = window.prompt("Motif fictif de correction");
      if (!reason || !reason.trim()) return;
      row.corrigee = true;
      data.transactions.unshift({ id: nextId(data.transactions), date: dateNow(), type: row.type === "Recette" ? "Dépense" : "Recette", libelle: `Extourne démo de #${id} : ${reason.trim()}`, fonds: row.fonds, montant: row.montant, reference: `EXT-DEMO-${id}`, corrigee: true });
      logAction("Extourne fictive", `Opération #${id} · ${reason.trim()}`);
    } else return;
    try {
      saveData();
      render();
    } catch (error) {
      showError(error.message);
    }
  }

  function listForAction(action) {
    if (action === "toggle-supplier") return data.fournisseurs;
    if (action === "pay-receipt") return data.receptions;
    if (action === "advance-order") return data.commandes;
    if (action === "validate-lot" || action === "reject-lot") return data.lots;
    if (action === "reverse-transaction") return data.transactions;
    return [];
  }

  function showError(message) {
    const root = document.getElementById("app-content");
    if (root) root.insertAdjacentHTML("afterbegin", `<div class="msg err" role="alert">${escapeHtml(message)}</div>`);
  }

  try {
    loadData();
    render();
  } catch (error) {
    const root = document.getElementById("app-content");
    if (root) root.innerHTML = `<div class="msg err" role="alert">${escapeHtml(error.message)}</div>`;
  }
})();
