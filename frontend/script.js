// -*- coding: utf-8 -*-

const API = 'http://localhost:8000/api';

function showAlert(msg, type = 'success') {
    const alert = document.getElementById('alert');
    alert.innerHTML = msg;
    alert.className = `alert alert-${type}`;
    setTimeout(() => {
        alert.className = '';
    }, 5000);
}

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };
        if (data) options.body = JSON.stringify(data);
        
        const res = await fetch(`${API}${endpoint}`, options);
        if (!res.ok) throw new Error(`Hiba: ${res.status}`);
        return await res.json();
    } catch (e) {
        showAlert('Hiba az adatok betöltésénél!', 'error');
        throw e;
    }
}

function loadPage(page) {
    if (page === 'dashboard') showDashboard();
    else if (page === 'ugyfel') showUgyfelList();
    else if (page === 'auto') showAutoList();
    else if (page === 'kolcsonzes') showKolcsonszesList();
}

function showDashboard() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="card"><h2>Betöltés...</h2></div>';
    
    Promise.all([
        apiCall('/ugyfel'),
        apiCall('/auto'),
        apiCall('/kolcsonzes')
    ]).then(([ugyfels, autoks, kolcsonzeseks]) => {
        const activeKolcsonzes = kolcsonzeseks.filter(k => !k.m_hozta).length;
        
        content.innerHTML = `
            <div class="stats">
                <div class="stat-card">
                    <h3>Összes Ügyfél</h3>
                    <div class="number">${ugyfels.length}</div>
                </div>
                <div class="stat-card">
                    <h3>Összes Autó</h3>
                    <div class="number">${autoks.length}</div>
                </div>
                <div class="stat-card">
                    <h3>Aktív Kölcsönzések</h3>
                    <div class="number">${activeKolcsonzes}</div>
                </div>
            </div>
            <div class="card">
                <h2>Üdvözlünk az Autóbérlés Rendszerben!</h2>
                <p>Válassz egy lehetőséget a navigációból a kezeléshez.</p>
            </div>
        `;
    }).catch(e => showAlert('Hiba az adatok betöltésénél!', 'error'));
}

function showUgyfelList() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="card"><h2>Betöltés...</h2></div>';
    
    apiCall('/ugyfel').then(ugyfels => {
        let html = `
            <div class="card">
                <div class="header-row">
                    <h2>Ügyfelek Listája</h2>
                    <button class="btn" onclick="showUgyfelForm()">+ Új Ügyfél</button>
                </div>
        `;
        
        if (ugyfels.length === 0) {
            html += '<p>Nincsenek ügyfelek.</p>';
        } else {
            html += `
                <table>
                    <tr>
                        <th>Szig</th>
                        <th>Név</th>
                        <th>Email</th>
                        <th>Telefonszám</th>
                        <th>Műveletek</th>
                    </tr>
            `;
            ugyfels.forEach(u => {
                html += `
                    <tr>
                        <td>${u.szig}</td>
                        <td>${u.nev}</td>
                        <td>${u.email}</td>
                        <td>${u.telefonszam}</td>
                        <td>
                            <button class="btn-success" onclick="editUgyfel(${u.ugyfel_id})">Szerkesztés</button>
                            <button class="btn-danger" onclick="deleteUgyfel(${u.ugyfel_id})">Törlés</button>
                        </td>
                    </tr>
                `;
            });
            html += '</table>';
        }
        html += '</div>';
        content.innerHTML = html;
    });
}

function showUgyfelForm(id = null) {
    const content = document.getElementById('content');
    
    if (id) {
        apiCall(`/ugyfel/${id}`).then(u => {
            content.innerHTML = `
                <div class="card">
                    <h2>Ügyfél Szerkesztése</h2>
                    <form onsubmit="saveUgyfel(event, ${id})">
                        <label>Név:</label>
                        <input type="text" value="${u.nev}" id="nev" required>
                        <label>Email:</label>
                        <input type="email" value="${u.email}" id="email" required>
                        <label>Telefonszám:</label>
                        <input type="text" value="${u.telefonszam}" id="telefonszam" required>
                        <div class="actions">
                            <button type="submit">Mentés</button>
                            <button type="button" onclick="showUgyfelList()">Mégse</button>
                        </div>
                    </form>
                </div>
            `;
        });
    } else {
        content.innerHTML = `
            <div class="card">
                <h2>Új Ügyfél</h2>
                <form onsubmit="saveUgyfel(event)">
                    <label>Szig:</label>
                    <input type="text" id="szig" maxlength="10" required>
                    <label>Név:</label>
                    <input type="text" id="nev" required>
                    <label>Email:</label>
                    <input type="email" id="email" required>
                    <label>Telefonszám:</label>
                    <input type="text" id="telefonszam" required>
                    <div class="actions">
                        <button type="submit">Mentés</button>
                        <button type="button" onclick="showUgyfelList()">Mégse</button>
                    </div>
                </form>
            </div>
        `;
    }
}

function saveUgyfel(e, id = null) {
    e.preventDefault();
    
    const data = {
        nev: document.getElementById('nev').value,
        email: document.getElementById('email').value,
        telefonszam: document.getElementById('telefonszam').value
    };
    
    if (!id) {
        data.szig = document.getElementById('szig').value;
    }
    
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/ugyfel/${id}` : '/ugyfel';
    
    apiCall(endpoint, method, data).then(() => {
        showAlert('Ügyfél sikeresen mentve!', 'success');
        setTimeout(() => showUgyfelList(), 1000);
    });
}

function editUgyfel(id) {
    showUgyfelForm(id);
}

function deleteUgyfel(id) {
    if (confirm('Biztosan törlöd?')) {
        apiCall(`/ugyfel/${id}`, 'DELETE').then(() => {
            showAlert('Ügyfél sikeresen törölve!', 'success');
            showUgyfelList();
        });
    }
}

function showAutoList() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="card"><h2>Betöltés...</h2></div>';
    
    apiCall('/auto').then(autoks => {
        let html = `
            <div class="card">
                <div class="header-row">
                    <h2>Autók Listája</h2>
                    <button class="btn" onclick="showAutoForm()">+ Új Autó</button>
                </div>
        `;
        
        if (autoks.length === 0) {
            html += '<p>Nincsenek autók.</p>';
        } else {
            html += `
                <table>
                    <tr>
                        <th>Rendszám</th>
                        <th>Típus</th>
                        <th>Márka</th>
                        <th>Szín</th>
                        <th>Műveletek</th>
                    </tr>
            `;
            autoks.forEach(a => {
                html += `
                    <tr>
                        <td>${a.rendszam}</td>
                        <td>${a.tipus}</td>
                        <td>${a.marka}</td>
                        <td>${a.szin}</td>
                        <td>
                            <button class="btn-success" onclick="editAuto(${a.auto_id})">Szerkesztés</button>
                            <button class="btn-danger" onclick="deleteAuto(${a.auto_id})">Törlés</button>
                        </td>
                    </tr>
                `;
            });
            html += '</table>';
        }
        html += '</div>';
        content.innerHTML = html;
    });
}

function showAutoForm(id = null) {
    const content = document.getElementById('content');
    
    if (id) {
        apiCall(`/auto/${id}`).then(a => {
            content.innerHTML = `
                <div class="card">
                    <h2>Autó Szerkesztése</h2>
                    <form onsubmit="saveAuto(event, ${id})">
                        <label>Típus:</label>
                        <input type="text" value="${a.tipus}" id="tipus" required>
                        <label>Márka:</label>
                        <input type="text" value="${a.marka}" id="marka" required>
                        <label>Szín:</label>
                        <input type="text" value="${a.szin}" id="szin" required>
                        <div class="actions">
                            <button type="submit">Mentés</button>
                            <button type="button" onclick="showAutoList()">Mégse</button>
                        </div>
                    </form>
                </div>
            `;
        });
    } else {
        content.innerHTML = `
            <div class="card">
                <h2>Új Autó</h2>
                <form onsubmit="saveAuto(event)">
                    <label>Rendszám:</label>
                    <input type="text" id="rendszam" maxlength="10" required>
                    <label>Típus:</label>
                    <input type="text" id="tipus" required>
                    <label>Márka:</label>
                    <input type="text" id="marka" required>
                    <label>Szín:</label>
                    <input type="text" id="szin" required>
                    <div class="actions">
                        <button type="submit">Mentés</button>
                        <button type="button" onclick="showAutoList()">Mégse</button>
                    </div>
                </form>
            </div>
        `;
    }
}

function saveAuto(e, id = null) {
    e.preventDefault();
    
    const data = {
        tipus: document.getElementById('tipus').value,
        marka: document.getElementById('marka').value,
        szin: document.getElementById('szin').value
    };
    
    if (!id) {
        data.rendszam = document.getElementById('rendszam').value;
    }
    
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/auto/${id}` : '/auto';
    
    apiCall(endpoint, method, data).then(() => {
        showAlert('Autó sikeresen mentve!', 'success');
        setTimeout(() => showAutoList(), 1000);
    });
}

function editAuto(id) {
    showAutoForm(id);
}

function deleteAuto(id) {
    if (confirm('Biztosan törlöd?')) {
        apiCall(`/auto/${id}`, 'DELETE').then(() => {
            showAlert('Autó sikeresen törölve!', 'success');
            showAutoList();
        });
    }
}

function showKolcsonszesList() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="card"><h2>Betöltés...</h2></div>';
    
    apiCall('/kolcsonzes').then(kolcsonzeseks => {
        let html = `
            <div class="card">
                <div class="header-row">
                    <h2>Kölcsönzések Listája</h2>
                    <button class="btn" onclick="showKolcsonsesForm()">+ Új Kölcsönzés</button>
                </div>
        `;
        
        if (kolcsonzeseks.length === 0) {
            html += '<p>Nincsenek kölcsönzések.</p>';
        } else {
            html += `
                <table>
                    <tr>
                        <th>Autó</th>
                        <th>Ügyfél</th>
                        <th>Elvitel</th>
                        <th>Visszahozás</th>
                        <th>Km (el.)</th>
                        <th>Km (vissza)</th>
                        <th>Napi díj</th>
                        <th>Műveletek</th>
                    </tr>
            `;
            kolcsonzeseks.forEach(k => {
                const mHozta = k.m_hozta ? new Date(k.m_hozta).toLocaleString('hu-HU') : 'Még nincs';
                html += `
                    <tr>
                        <td>${k.auto.rendszam}</td>
                        <td>${k.ugyfel.nev}</td>
                        <td>${new Date(k.m_vitte).toLocaleString('hu-HU')}</td>
                        <td>${mHozta}</td>
                        <td>${k.km_elvitel}</td>
                        <td>${k.km_hozatal || '-'}</td>
                        <td>${k.napidij} Ft</td>
                        <td>
                            <button class="btn-success" onclick="editKolcsonzes(${k.kolcson_id})">Szerkesztés</button>
                            <button class="btn-danger" onclick="deleteKolcsonzes(${k.kolcson_id})">Törlés</button>
                        </td>
                    </tr>
                `;
            });
            html += '</table>';
        }
        html += '</div>';
        content.innerHTML = html;
    });
}

function showKolcsonsesForm(id = null) {
    const content = document.getElementById('content');
    
    Promise.all([apiCall('/ugyfel'), apiCall('/auto')]).then(([ugyfels, autoks]) => {
        if (id) {
            apiCall(`/kolcsonzes/${id}`).then(k => {
                content.innerHTML = `
                    <div class="card">
                        <h2>Kölcsönzés Szerkesztése</h2>
                        <form onsubmit="saveKolcsonzes(event, ${id})">
                            <label>Autó: ${k.auto.rendszam}</label>
                            <label>Ügyfél: ${k.ugyfel.nev}</label>
                            <label>Visszahozás:</label>
                            <input type="datetime-local" id="m_hozta" value="${k.m_hozta || ''}">
                            <label>Km visszaadáskor:</label>
                            <input type="number" id="km_hozatal" value="${k.km_hozatal || ''}">
                            <div class="actions">
                                <button type="submit">Mentés</button>
                                <button type="button" onclick="showKolcsonszesList()">Mégse</button>
                            </div>
                        </form>
                    </div>
                `;
            });
        } else {
            let options1 = '<option value="">-- Válassz ügyfelet --</option>';
            let options2 = '<option value="">-- Válassz autót --</option>';
            
            ugyfels.forEach(u => {
                options1 += `<option value="${u.ugyfel_id}">${u.nev}</option>`;
            });
            autoks.forEach(a => {
                options2 += `<option value="${a.auto_id}">${a.rendszam} - ${a.marka}</option>`;
            });
            
            content.innerHTML = `
                <div class="card">
                    <h2>Új Kölcsönzés</h2>
                    <form onsubmit="saveKolcsonzes(event)">
                        <label>Ügyfél:</label>
                        <select id="ugyfel_id" required>${options1}</select>
                        <label>Autó:</label>
                        <select id="auto_id" required>${options2}</select>
                        <label>Elvitel:</label>
                        <input type="datetime-local" id="m_vitte" required>
                        <label>Km induláskor:</label>
                        <input type="number" id="km_elvitel" required>
                        <label>Napi díj (Ft):</label>
                        <input type="number" id="napidij" step="0.01" required>
                        <div class="actions">
                            <button type="submit">Mentés</button>
                            <button type="button" onclick="showKolcsonszesList()">Mégse</button>
                        </div>
                    </form>
                </div>
            `;
        }
    });
}

function saveKolcsonzes(e, id = null) {
    e.preventDefault();
    
    const data = {
        m_hozta: document.getElementById('m_hozta')?.value || null,
        km_hozatal: document.getElementById('km_hozatal')?.value || null
    };
    
    if (!id) {
        data.ugyfel_id = document.getElementById('ugyfel_id').value;
        data.auto_id = document.getElementById('auto_id').value;
        data.m_vitte = document.getElementById('m_vitte').value;
        data.km_elvitel = document.getElementById('km_elvitel').value;
        data.napidij = document.getElementById('napidij').value;
    }
    
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/kolcsonzes/${id}` : '/kolcsonzes';
    
    apiCall(endpoint, method, data).then(() => {
        showAlert('Kölcsönzés sikeresen mentve!', 'success');
        setTimeout(() => showKolcsonszesList(), 1000);
    });
}

function editKolcsonzes(id) {
    showKolcsonsesForm(id);
}

function deleteKolcsonzes(id) {
    if (confirm('Biztosan törlöd?')) {
        apiCall(`/kolcsonzes/${id}`, 'DELETE').then(() => {
            showAlert('Kölcsönzés sikeresen törölve!', 'success');
            showKolcsonszesList();
        });
    }
}

window.addEventListener('load', () => {
    loadPage('dashboard');
});
