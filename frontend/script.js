const apiBaseUrl = '/api';

function showSection(sectionId) {
    document.getElementById('customersSection').classList.add('hidden');
    document.getElementById('carsSection').classList.add('hidden');
    document.getElementById('rentalsSection').classList.add('hidden');
    document.getElementById(sectionId).classList.remove('hidden');
    document.querySelectorAll('nav button').forEach(button => button.classList.remove('active'));
    document.querySelector(`nav button[data-section="${sectionId}"]`).classList.add('active');
}
document.querySelectorAll('nav button').forEach(button => {
    button.onclick = () => showSection(button.getAttribute('data-section'));
});
showSection('customersSection');

async function getAll(endpoint) {
    const response = await fetch(apiBaseUrl + endpoint);
    if (response.ok) {
        return await response.json();
    }
    return [];
}
async function createNew(endpoint, data) {
    const response = await fetch(apiBaseUrl + endpoint, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
    return response.ok;
}
async function deleteById(endpoint, id) {
    const response = await fetch(apiBaseUrl + endpoint + '/' + id, { method: 'DELETE' });
    return response.ok;
}

async function loadCustomers() {
    const customers = await getAll('/ugyfelek');
    renderCustomers(customers);
    updateCustomerSelect(customers);
}
function renderCustomers(customers) {
    const customersList = document.getElementById('customersList');
    customersList.innerHTML = "";
    customers.forEach(customer => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${customer.nev} <span>| ${customer.szig} | ${customer.email} | ${customer.telefonszam}</span>
            <button class="cancel" onclick="deleteCustomer(${customer.ugyfel_id})">Törlés</button>`;
        customersList.appendChild(listItem);
    });
}
window.deleteCustomer = async function(customerId) {
    await deleteById('/ugyfelek', customerId);
    loadCustomers();
};

document.getElementById('addCustomerBtn').onclick = () =>
    document.getElementById('customerForm').classList.remove('hidden');
document.getElementById('cancelCustomerBtn').onclick = () =>
    document.getElementById('customerForm').classList.add('hidden');
document.getElementById('saveCustomerBtn').onclick = async () => {
    const nev = document.getElementById('customerName').value.trim();
    const szig = document.getElementById('customerSzig').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const telefonszam = document.getElementById('customerPhone').value.trim();
    if (nev && szig && email && telefonszam) {
        await createNew('/ugyfelek', {nev, szig, email, telefonszam});
        document.getElementById('customerForm').classList.add('hidden');
        document.getElementById('customerForm').querySelectorAll('input').forEach(input => input.value = '');
        loadCustomers();
    } else {
        alert('Minden mező kötelező!');
    }
};

async function loadCars() {
    const cars = await getAll('/autok');
    renderCars(cars);
    updateCarSelect(cars);
}
function renderCars(cars) {
    const carsList = document.getElementById('carsList');
    carsList.innerHTML = "";
    cars.forEach(car => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${car.marka} ${car.rendszam} <span>| ${car.tipus} | ${car.szin}</span>
            <button class="cancel" onclick="deleteCar(${car.auto_id})">Törlés</button>`;
        carsList.appendChild(listItem);
    });
}
window.deleteCar = async function(carId) {
    await deleteById('/autok', carId);
    loadCars();
};

document.getElementById('addCarBtn').onclick = () =>
    document.getElementById('carForm').classList.remove('hidden');
document.getElementById('cancelCarBtn').onclick = () =>
    document.getElementById('carForm').classList.add('hidden');
document.getElementById('saveCarBtn').onclick = async () => {
    const rendszam = document.getElementById('carPlate').value.trim();
    const tipus = document.getElementById('carType').value.trim();
    const marka = document.getElementById('carBrand').value.trim();
    const szin = document.getElementById('carColor').value.trim();
    if (rendszam && tipus && marka && szin) {
        await createNew('/autok', {rendszam, tipus, marka, szin});
        document.getElementById('carForm').classList.add('hidden');
        document.getElementById('carForm').querySelectorAll('input').forEach(input => input.value = '');
        loadCars();
    } else {
        alert('Minden mező kötelező!');
    }
};

async function loadRentals() {
    const rentals = await getAll('/kolcsonzesek');
    const customers = await getAll('/ugyfelek');
    const cars = await getAll('/autok');
    renderRentals(rentals, customers, cars);
}
function renderRentals(rentals, customers, cars) {
    const rentalsList = document.getElementById('rentalsList');
    rentalsList.innerHTML = "";
    rentals.forEach(rental => {
        const customer = customers.find(cust => cust.ugyfel_id === rental.ugyfel_id);
        const car = cars.find(carObj => carObj.auto_id === rental.auto_id);
        const megtettKm = rental.km_hozta - rental.km_vitte;
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${customer ? customer.nev : ''} &harr; ${car ? car.marka + ' ' + car.rendszam : ''} 
            <span>| ${rental.mikor_vitte} → ${rental.mikor_hozta} | ${megtettKm} km | ${rental.napidij} Ft/nap</span>
            <button class="cancel" onclick="deleteRental(${rental.kolcsonzes_id})">Törlés</button>`;
        rentalsList.appendChild(listItem);
    });
}
window.deleteRental = async function(rentalId) {
    await deleteById('/kolcsonzesek', rentalId);
    loadRentals();
};

document.getElementById('addRentalBtn').onclick = () =>
    document.getElementById('rentalForm').classList.remove('hidden');
document.getElementById('cancelRentalBtn').onclick = () =>
    document.getElementById('rentalForm').classList.add('hidden');
document.getElementById('saveRentalBtn').onclick = async () => {
    const auto_id = document.getElementById('rentalCar').value;
    const ugyfel_id = document.getElementById('rentalCustomer').value;
    const mikor_vitte = document.getElementById('rentalStart').value;
    const mikor_hozta = document.getElementById('rentalEnd').value;
    const km_vitte = document.getElementById('rentalStartKm').value;
    const km_hozta = document.getElementById('rentalEndKm').value;
    const napidij = document.getElementById('rentalDailyFee').value;
    if (auto_id && ugyfel_id && mikor_vitte && mikor_hozta && km_vitte && km_hozta && napidij) {
        await createNew('/kolcsonzesek', {
            auto_id, ugyfel_id, mikor_vitte, mikor_hozta, km_vitte, km_hozta, napidij
        });
        document.getElementById('rentalForm').classList.add('hidden');
        document.getElementById('rentalForm').querySelectorAll('input,select').forEach(input => input.value = '');
        loadRentals();
    } else {
        alert('Minden mező kötelező!');
    }
};

async function updateCarSelect(carsArg = null) {
    const cars = carsArg || await getAll('/autok');
    const rentalCarSelect = document.getElementById('rentalCar');
    rentalCarSelect.innerHTML = '<option value="">--</option>';
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.auto_id;
        option.textContent = car.marka + ' ' + car.rendszam;
        rentalCarSelect.appendChild(option);
    });
}
async function updateCustomerSelect(customersArg = null) {
    const customers = customersArg || await getAll('/ugyfelek');
    const rentalCustomerSelect = document.getElementById('rentalCustomer');
    rentalCustomerSelect.innerHTML = '<option value="">--</option>';
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.ugyfel_id;
        option.textContent = customer.nev + ' (' + customer.szig + ')';
        rentalCustomerSelect.appendChild(option);
    });
}

loadCustomers();
loadCars();
loadRentals();
