// @NOTE: UNTUK FORMAT RUPIAH
export const currencyFormatter = (item) => {
    const amountString = String(item).split('').reverse().join('');
    const amountLeng = amountString.length;
    let output = "";

    for (let i = 0; i < amountLeng; i++) {
        if (i % 3 === 0) {
            output += amountString.substr(i, 3) + '.'
        }
    }

    return 'Rp' + output.split('', output.length - 1).reverse().join('');
}

// @NOTE: UNTUK FORMAT TANGGAL
export const dateFormatter = (item) => {
    const dateString = item.replace(' ', '-').split('-');
    let tanggal = dateString[2];
    let bulan = dateString[1];
    let tahun = dateString[0];


    if (tanggal.startsWith('0')) tanggal = tanggal.split('')[1];
    else tanggal = tanggal;

    if (bulan.startsWith('0')) bulan = bulan.split('')[1];
    else bulan = bulan;

    const arrayBulan = new Array(12);
    arrayBulan[1] = 'Januari';
    arrayBulan[2] = 'Februari';
    arrayBulan[3] = 'Maret';
    arrayBulan[4] = 'April';
    arrayBulan[5] = 'Mei';
    arrayBulan[6] = 'Juni';
    arrayBulan[7] = 'Juli';
    arrayBulan[8] = 'Agustus';
    arrayBulan[9] = 'September';
    arrayBulan[10] = 'Oktober';
    arrayBulan[11] = 'November';
    arrayBulan[12] = 'Desember';

    return tanggal + ' ' + arrayBulan[bulan] + ' ' + tahun;
}