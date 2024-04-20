var sel_country = [];
var sel_state = [];
var sel_months = [];
var sel_years = [];
var Layergrp = L.layerGroup().addTo(map);
var selected_all = {}; // select all for states
var selected_all_months = false; // default false
var selected_all_year = false; // default false

$(document).ready(function () {
    $.ajax({
        url: '/getdata',
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function (response) {
            var country_data = response.country;
            var state_data = response.state;
            main(country_data, state_data);
        }

    })
});

function main(country_data, state_data) {
    const countryNames = country_data.map(country => country.name);
    $('#form .select').on('click', function () {
        var select = $(this).attr('data');
        $(this).addClass('active').siblings().removeClass('active');
        $('.r2_panel .r2-heading').text(select);
        if (select == 'country') {
            $('.r2_panel .selection-area').empty();
            var options = countryNames;
            for (var i = 0; i < options.length; i++) {
                var html = `<li class='select' name="${options[i].toLowerCase()}">${options[i]}</li>`;
                $('.r2_panel .selection-area').append(html);
            }
            if (sel_country.length !== 0) {
                for (var i = 0; i < sel_country.length; i++) {
                    $(`.r2_panel .selection-area li[name = '${sel_country[i]}']`).addClass('active');
                }
            }

            $('.r2_panel .selection-area li').on('click', function () {
                var country = $(this).attr('name');
                sel_state = [];
                $('#form #state-sel').css('color', '#ffffff');
                if (sel_country.includes(country)) {
                    sel_country = sel_country.filter(e => e !== country);
                    $(this).removeClass('active');
                } else {
                    sel_country.push(country);
                    $(this).addClass('active');
                }
                if (sel_country.length !== 0) {
                    $('#form #country-sel').css('color', '#adf5ff');
                } else {
                    $('#form #country-sel').css('color', '#ffffff');
                }
            });

        }
        if (select == 'state') {
            if (sel_country.length === 0) {
                $('.notification').text('select a country first !!');
                $('.notification').show();
                setTimeout(function () {
                    $('.notification').hide();
                }, 2000);
                $('#form #country-sel').trigger('click');
                return;
            }
            $('.r2_panel .selection-area').empty();
            for (let j = 0; j < sel_country.length; j++) {
                var options = [];
                for (let z = 0; z < state_data.length; z++) {
                    if (countryNames[state_data[z].country_id - 1].toLowerCase() === sel_country[j]) {
                        options.push(state_data[z].name);
                    }
                }

                let html_head = `<li class='heading select' name="${sel_country[j].toLowerCase()}">${sel_country[j]}</li>`;
                $('.r2_panel .selection-area').append(html_head);

                if (sel_country[j].toLowerCase() in selected_all){
                    if (selected_all[sel_country[j].toLowerCase()] == true){
                        $(`.r2_panel .selection-area li.heading[name = '${sel_country[j].toLowerCase()}']`).addClass('active');
                    }
                }
                else{
                    selected_all[sel_country[j].toLowerCase()] = false;
                }
                
                for (let i = 0; i < options.length; i++) {
                    var html = `<li class='item select' country_name="${sel_country[j].toLowerCase()}" name="${options[i].toLowerCase()}">${options[i]}</li>`;
                    $('.r2_panel .selection-area').append(html);
                }
            }

            if (sel_state.length !== 0) {
                for (var i = 0; i < sel_state.length; i++) {
                    $(`.r2_panel .selection-area li.item[name = '${sel_state[i]}']`).addClass('active');
                }
            }

            $('.r2_panel .selection-area li.heading').on('click', function () {

                var country = $(this).attr('name');

                if (selected_all[country] == false) {
                    $(this).addClass('active');

                    for (let i = 0; i < state_data.length; i++) {
                        var state;
                        if (countryNames[state_data[i].country_id - 1].toLowerCase() == country) {
                            state = state_data[i].name.toLowerCase();
                        }
                        if (state !== undefined) {
                            if (sel_state.includes(state)) {
                                continue;
                            } else {
                                sel_state.push(state);
                                $(`.r2_panel .selection-area li.item[name = '${state}']`).addClass('active');
                            }
                        }

                    }
                    selected_all[country] = true;
                }
                else {
                    $(this).removeClass('active');
                    for (let i = 0; i < state_data.length; i++) {
                        var state;
                        if (countryNames[state_data[i].country_id - 1].toLowerCase() == country) {
                            state = state_data[i].name.toLowerCase();
                        }
                        if (sel_state.includes(state)) {
                            sel_state = sel_state.filter(e => e !== state);
                            $(`.r2_panel .selection-area li.item[name = '${state}']`).removeClass('active');
                        } else {
                            continue;
                        }
                    }
                    selected_all[country] = false;
                }
            });

            $('.r2_panel .selection-area li.item.select').on('click', function () {
                var state = $(this).attr('name');
                var country_st = $(this).attr('country_name');
                if (selected_all[country_st] == true) {
                    $(`.r2_panel .selection-area li.heading[name='${country_st}'].heading`).removeClass('active');
                    selected_all[country_st] = false;
                }
                if (sel_state.includes(state)) {
                    sel_state = sel_state.filter(e => e !== state);
                    $(this).removeClass('active');
                } else {
                    sel_state.push(state);
                    $(this).addClass('active');

                }
                if (sel_state.length !== 0) {
                    $('#form #state-sel').css('color', '#adf5ff');
                } else {
                    $('#form #state-sel').css('color', '#ffffff');
                }
            });
        }
        if (select == 'branch'){
            if (sel_country.length === 0) {
                $('.notification').text('select a country first !!');
                $('.notification').show();
                setTimeout(function () {
                    $('.notification').hide();
                }, 2000);
                $('#form #country-sel').trigger('click');
                return;
            }
            if (sel_state.length === 0) {
                $('.notification').text('select a State first !!');
                $('.notification').show();
                setTimeout(function () {
                    $('.notification').hide();
                }, 2000);
                $('#form #state-sel').trigger('click');
                return;
            }
            $('.r2_panel .selection-area').empty();

            var html = `
            <li class="date selector">
                <ul class="date-select" name='month'>
                    <li class="heading select" name='month'>Month</li>
                    <li class="item select" name='1'>Jan.</li>
                    <li class="item select" name='2'>Feb.</li>
                    <li class="item select" name='3'>March</li>
                    <li class="item select" name='4'>April</li>
                    <li class="item select" name='5'>May</li>
                    <li class="item select" name='6'>June</li>
                    <li class="item select" name='7'>July</li>
                    <li class="item select" name='8'>Aug.</li>
                    <li class="item select" name='9'>Sept.</li>
                    <li class="item select" name='10'>Oct.</li>
                    <li class="item select" name='11'>Nov.</li>
                    <li class="item select" name='12'>Dec.</li>
                </ul>
                <ul class="date-select" name="year">
                    <li class="heading select" name='year'>year</li>
                    <li class="item select" name='2019'>2019</li>
                    <li class="item select" name='2020'>2020</li>
                    <li class="item select" name='2021'>2021</li>
                    <li class="item select" name='2022'>2022</li>
                    <li class="item select" name='2023'>2023</li>
                    <li class="item select" name='2024'>2024</li>
                </ul>
            </li> 
            `;
            $('.r2_panel .selection-area').append(html);

            if (sel_months.length !== 0) {
                for (var i = 0; i < sel_months.length; i++) {
                    $(`.r2_panel .selection-area li.date ul[name="month"] li.item[name = '${sel_months[i]}']`).addClass('active');
                }
            }
            if (sel_years.length !== 0) {
                for (var i = 0; i < sel_years.length; i++) {
                    $(`.r2_panel .selection-area li.date ul[name="year"] li.item[name = '${sel_years[i]}']`).addClass('active');
                }
            }

            $('.r2_panel .selection-area li.date ul[name="month"] li.heading.select').on('click', function () {
                if (selected_all_months == false) {
                    $(this).addClass('active');
                    $(this).siblings().addClass('active');
                    sel_months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
                    selected_all_months = true;
                } else {
                    $(this).removeClass('active');
                    $(this).siblings().removeClass('active');
                    sel_months = [];
                    selected_all_months = false;
                }
                if (sel_months.length !== 0 && sel_years.length !== 0) {
                    $('#form #branch-sel').css('color', '#adf5ff');
                } else {
                    $('#form #branch-sel').css('color', '#ffffff');
                }
            });

            $('.r2_panel .selection-area li.date ul[name="year"] li.heading.select').on('click', function () {
                if (selected_all_year == false) {
                    $(this).addClass('active');
                    $(this).siblings().addClass('active');
                    sel_years = ['2019', '2020', '2021', '2022', '2023', '2024'];
                    selected_all_year = true;
                } else {
                    $(this).removeClass('active');
                    $(this).siblings().removeClass('active');
                    sel_years = [];
                    selected_all_year = false;
                }
                if (sel_months.length !== 0 && sel_years.length !== 0) {
                    $('#form #branch-sel').css('color', '#adf5ff');
                } else {
                    $('#form #branch-sel').css('color', '#ffffff');
                }
            });
            
            $(".r2_panel .selection-area li.date ul[name='month'] li.item.select").on('click', function () {
                var month = $(this).attr('name');
                if (selected_all_months === true) {
                    selected_all_months = false;
                    $(this).siblings('.heading').removeClass('active');
                }
                if (sel_months.includes(month)) {
                    sel_months = sel_months.filter(e => e !== month);
                    $(this).removeClass('active');
                } else {
                    sel_months.push(month);
                    $(this).addClass('active');
                }

                if (sel_months.length !== 0 && sel_years.length !== 0) {
                    $('#form #branch-sel').css('color', '#adf5ff');
                } else {
                    $('#form #branch-sel').css('color', '#ffffff');
                }
            });

            $(".r2_panel .selection-area li.date ul[name='year'] li.item.select").on('click', function () {
                var year = $(this).attr('name');
                if (selected_all_year === true) {
                    selected_all_year = false;
                    $(this).siblings('.heading').removeClass('active');
                }
                if (sel_years.includes(year)) {
                    sel_years = sel_years.filter(e => e !== year);
                    $(this).removeClass('active');
                } else {
                    sel_years.push(year);
                    $(this).addClass('active');
                }

                if (sel_months.length !== 0 && sel_years.length !== 0) {
                    $('#form #branch-sel').css('color', '#adf5ff');
                } else {
                    $('#form #branch-sel').css('color', '#ffffff');
                }
            });

            if (sel_months.length !== 0 && sel_years.length !== 0) {
                $('#form #branch-sel').css('color', '#adf5ff');
            } else {
                $('#form #branch-sel').css('color', '#ffffff');
            }
            

        }

        $('.r1_panel .btn-form .select').off('click');

        $('.r1_panel .btn-form .select').on('click', function () {
            var btn = $(this).attr('data');
            Layergrp.clearLayers();
            $('.table-body-custom').empty();
            if (btn == 'submit') {
                if (sel_country.length === 0) {
                    $('.notification').text('select a country first !!');
                    $('.notification').show();
                    setTimeout(function () {
                        $('.notification').hide();
                    }, 2000);
                    $('#form #country-sel').trigger('click');
                    return;
                }
                if (sel_months.length !== 0 && sel_years.length === 0) {
                    $('.notification').text('select a year first !!');
                    $('.notification').show();
                    setTimeout(function () {
                        $('.notification').hide();
                    }, 2000);
                    $('#form #branch-sel').trigger('click');
                    return;
                }
                if (sel_months.length === 0 && sel_years.length !== 0) {
                    $('.notification').text('select a month first !!');
                    $('.notification').show();
                    setTimeout(function () {
                        $('.notification').hide();
                    }, 2000);
                    $('#form #branch-sel').trigger('click');
                    return;
                }
                if (sel_months.length !== 0 && sel_years.length !== 0) {
                    $.ajax({
                        url: '/getbranchdata',
                        type: 'GET',
                        data: {
                            month: sel_months,
                            year: sel_years,
                            country: sel_country,
                            state: sel_state
                        },
                        dataType: 'json',
                        success: function (response) {
                        
                        }
                    });
                }
                boundary(sel_country, sel_state, country_data, state_data);
                tables_panel(sel_country, country_data, '#table-country');
                tables_panel(sel_state, state_data, '#table-state');
            }
            else if (btn == 'reset') {
                sel_country = [];
                sel_state = [];
                Layergrp.clearLayers();
                $('#form #country-sel').css('color', '#ffffff');
                $('#form #state-sel').css('color', '#ffffff');
                map.setView([23.7, 78], 3);
                $('#form #country-sel').trigger('click');
            }
        });
    });

    //default click on form select country
    $('#form #country-sel').trigger('click');

    function fetchboundarycountry(data, callback) {
        $.getJSON(`static/data/${data}-country.geojson`, function (data) {
            var bound = data;
            callback(bound);
        });
    }

    function fetchboundarystate(data, callback) {
        $.getJSON(`static/data/${data}-state.geojson`, function (data) {
            var bound = data;
            callback(bound);
        });
    }

    //fetch data for tables
    function tables_panel(sel_data, all_data, table_id) {
        var data = [];
        for (let i = 0; i < sel_data.length; i++) {
            let d = all_data.filter(e => e.name.toLowerCase() === sel_data[i]);
            data.push(d[0]);
        }
        for (let i = 0; i < data.length; i++) {
            var table_body = $(table_id);
            if (table_id == '#table-country') {
                var html = `<tr>
                                <td>${data[i].name}</td>
                                <td>${data[i].capital}</td>
                                <td>${data[i].states}</td>
                                <td>${data[i].population}</td>
                            </tr>`;
                table_body.append(html);
            }
            else if (table_id == '#table-state') {
                var html = `<tr>
                                <td>${countryNames[data[i].country_id - 1]}</td>
                                <td>${data[i].name}</td>
                                <td>${data[i].population}</td>
                            </tr>`;
                table_body.append(html);
            }
        }
    }


    //fetch boundary data
    function boundary(sel_country, sel_state = [], country_data, state_data) {
        var countrybound;
        var statebound;
        if (sel_country.length !== 0) {
            for (let i = 0; i < sel_country.length; i++) {

                fetchboundarycountry(sel_country[i], function (data) {
                    let d = country_data.filter(e => e.name.toLowerCase() === sel_country[i]);
                    var popupcountry = `<table class="table-custom" style="font-size: 12px;">
                                            <thead>
                                                <tr>
                                                    <th>Info</th>
                                                    <th>Values</th>
                                                </tr>
                                            </thead>
                                            <tbody class="table-group-divider table-body-custom">
                                                <tr>
                                                    <td>Country Name</td>
                                                    <td>${d[0].name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Capital</td>
                                                    <td>${d[0].capital}</td>
                                                </tr>
                                                <tr>
                                                    <td>States</td>
                                                    <td>${d[0].states}</td>
                                                </tr>
                                                <tr>
                                                    <td>Population</td>
                                                <td>${d[0].population}</td>
                                                </tr>
                                            </tbody>
                                        </table>`;
                    countrybound = L.geoJSON(data['features'][0], {
                        style: {
                            color: '#0064ff',
                            fillOpacity: 0.15,
                            weight: 2
                        }
                    }).addTo(Layergrp).bindPopup(popupcountry);
                    if (sel_country.length == 1 && sel_state.length !== 1) {
                        map.fitBounds(countrybound.getBounds());
                    }
                });

                if (sel_state.length !== 0) {
                    fetchboundarystate(sel_country[i], function (data) {
                        data['features'].forEach(feature => {
                            let d = state_data.filter(e => e.name.toLowerCase() === feature['properties']['shapeName'].toLowerCase());
                            console.log(d[0]);
                            console.log(sel_state);
                            console.log(feature['properties']['shapeName'].toLowerCase());
                            var popupstate = `<table class="table-custom" style="font-size: 12px;">
                                                    <thead>
                                                        <tr>
                                                            <th>Info</th>
                                                            <th>Values</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="table-group-divider table-body-custom">
                                                        <tr>
                                                            <td>Country Name</td>
                                                            <td>${countryNames[d[0].country_id - 1]}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>State</td>
                                                            <td>${d[0].name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Population</td>
                                                        <td>${d[0].population}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>`;
                            if (sel_state.includes(feature['properties']['shapeName'].toLowerCase())) {
                                statebound = L.geoJSON(feature, {
                                    style: {
                                        color: '#7800ff',
                                        fillOpacity: 0.2,
                                        weight: 2.5
                                    }
                                }).addTo(Layergrp).bindPopup(popupstate);
                                if (sel_state.length == 1) {
                                    map.fitBounds(statebound.getBounds());
                                }
                            }
                        });
                    });
                }
            }

        }
    }

    $('.l2_panel .select.open-popup').off('click');

    $('.left_panel .popupwindow .exit-cross').on('click', function () {
        $('.l2_panel .select.open-popup').removeClass('active');
        $('.popupwindow').css('transform', 'translate(0,-500%)');
    });

    $('.l2_panel .select.open-popup').on('click', function () {
        var name = $(this).attr('name');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.popupwindow').css('transform', 'translate(0,-500%)');
        } else {
            $('.popupwindow .popup-heading').text(name);
            $('.popupwindow .popup-content').not('.popupwindow .popup-content[name = ' + name + ']').hide();
            $('.popupwindow .popup-content[name = ' + name + ']').show();
            $('.l2_panel .select.open-popup').not('.l2_panel .select.open-popup[name = ' + name + ']').removeClass('active');
            $('.popupwindow').css('transform', 'translate(0,0)');
            $(this).addClass('active');
            if (name == 'settings') {
                if ($(window).width() <= 425) {
                    $('.popupwindow').css('top', '38%');
                    $('.popupwindow').css('left', '10%');
                    $('.popupwindow').css('width', '70%');
                    $('.popupwindow').css('height', '30%');
                }
                else if ($(window).width() <= 1024) {
                    $('.popupwindow').css('top', '38%');
                    $('.popupwindow').css('left', '2%');
                    $('.popupwindow').css('width', '30%');
                    $('.popupwindow').css('height', '40%');
                }
                else{
                    $('.popupwindow').css('top', '25%');
                    $('.popupwindow').css('left', '1%');
                    $('.popupwindow').css('width', '30%');
                    $('.popupwindow').css('height', '50%');
                }
            } else {
                if($(window).width() <= 425){
                    $('.popupwindow').css('top', '18%');
                    $('.popupwindow').css('left', '2%');
                    $('.popupwindow').css('width', '95%');
                    $('.popupwindow').css('height', '50%');
                }
                else{
                    $('.popupwindow').css('top', '10%');
                    $('.popupwindow').css('left', '20%');
                    $('.popupwindow').css('width', '60%');
                    $('.popupwindow').css('height', '60%');
                }
            }
        }
    });

    $('.popup-content.info .buttons-navs .select').on('click', function () {
        var name = $(this).attr('name');
        $('.table-custom').not('.table-custom[name = ' + name + ']').hide();
        $('.table-custom[name = ' + name + ']').show();
        $(this).addClass('active').siblings().removeClass('active');
    });
}

$(document).ready(function () {
    let writeIndex = 0;

    function writeTitle() {
        let word = 'Yash Aggarwal';
        if (writeIndex == 0) {
            document.getElementById("preloading-title").innerHTML = ""; // Clear subtitle
        }
        if (writeIndex < word.length) {
            let sub_elem = document.getElementById("preloading-title");
            sub_elem.innerHTML += word[writeIndex];
            writeIndex++;
        }
    }

    setTimeout(() => {
        $('body .preloading .load-square').css('transform', 'translate(0,0)');
        $('body .preloading .load-circle').css('transform', 'translate(0,0)');
    }, 100);
    setTimeout(() => {
        $('body .preloading .load-square').css('rotate', '45deg');
        $('body .preloading .load-circle').css('rotate', '45deg');
        $('body .preloading .load-square').css('background-color', '#33373d');
        $('body .preloading .load-circle').css('background-color', '#33373d');
        setInterval(writeTitle, 150);
    }, 600);
    setTimeout(() => {
        $('body .preloading .load-square').css('box-shadow', '5px 0px 15px #ffffff8a inset, -10px -15px 15px black inset');
        $('body .preloading .load-circle').css('box-shadow', '10px 15px 15px black inset, 0px -5px 15px #ffffff8a inset');
        let w = $(window).width();
        let set_w = w <= 450 ? 75 : w <= 800 ? 60 : 40;
        let set_h = w <= 450 ? 20 : 40;
        $('body .preloading .preloader').css('width', `${set_w}%`);
        $('body .preloading .preloader').css('height', `${set_h}%`);
        $('body .preloading .preloader').css('z-index', '1000');
    }, 900);
    setTimeout(() => {
        $('body .preloading .load-square').css('filter', 'drop-shadow(0px 0px 20px rgb(0 135 255))');
        $('body .preloading .load-circle').css('filter', 'drop-shadow(0px 0px 20px rgb(153, 255, 0))');
        $('body .preloading .preloader').css('box-shadow', '1px 1px 25px rgb(0 0 0 / 80%)');
    }, 1200);
    setTimeout(() => {
        $('body .preloading .preloader').css('backdrop-filter', 'blur(10px)');
    }, 1500);
    setTimeout(() => {
        $('body .preloading .preloader').css('width', '100%');
        $('body .preloading .preloader').css('height', '100%');
    }, 3000);
    setTimeout(() => {
        $('body .preloading').hide();
        $('body').css('overflow', 'unset');
        $('body .container-fluid.bodymain').css('opacity', '1');
    }, 4000);

});