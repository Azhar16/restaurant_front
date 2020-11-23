var SALES = {
    customer: [],
    all_tax:[],
    hsn: '-1',
    gst: 0,
    comstate:'',
    print:'',
    initS: function () {
        $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/sales/ajaxget",
                type: 'POST',
                data: function (d) {
                    setTimeout(SALES.initButton, 1000);
                }
            }
        });
        $(".s-l-cn").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get("/sales/new", function (data) {
                $('#mainContent').html(data);
            });
        });
        SALES.initButton();
    },
    initButton:function(){
        $(".s-l-e").on("click", function (e) {
            var id=$(this).attr('data-id');
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/sales/edit/' + id, function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-v").on("click", function (e) {
            $('#mainContent').html("<div class='loading'></div>");
            $.get('/sales/bill/' + $(this).attr('data-id'), function (data) {
                $('#mainContent').html(data);
            });
        });
        $(".s-l-d").on("click", function (e) {
            var cid = $(this).attr('data-id');
            swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger m-l-10',
                buttonsStyling: false
            }).then(function () {
                $.get('/sales/delete/' + cid, function (data) {
                    $('#datatable').DataTable().ajax.reload();
                    COMMON.shownotification('error', 'Sales deleted successfully!!!');
                });
            });

        });
    },
    initSN: function (comstate,tax_slab) {
        SALES.comstate=comstate;
        SALES.all_tax=tax_slab;
        $("#salesunit").select2();
        $('#frmSNew').parsley();
        $('#frmSNew').submit(function (e) {
            e.preventDefault();
            if ($(this).parsley().isValid()) {
                SALES.submitSNewFrm();
            }
        });
        $(".s-n-bk").on("click", function (e) {
            location.reload();
        });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this);
        });
        $(".new-shipping").on("click", function (e) {
            if (typeof SALES.customer.id !== 'undefined' ){
                $(this).attr('data-href','/customer/shippingnew/'+SALES.customer.id);
                COMMON.loadCustomModal(this,SALES.getShipping);
            }else{
                COMMON.shownotification('error', 'Select a customer firest!!!');
            }
        });
        $(".sa-field").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            SALES.claculateSaFieldPrice(rw);
        });
        $(".i-r-o-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".safildwrap");
            SALES.claculateSaFieldPrice(rw);
        });
        $("#shipping").on("change", function() {
            $.get('/customer/shippingbyid/' + $(this).val(), function (data) {
                var sd = JSON.parse(data);
                SALES.customer.state=sd[0].state;
                SALES.gstInit();
                SALES.calculateTotPrice();
            });
        });
        jQuery('#bill_date').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        $("#customer").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/customer/autocustomer/" + request.term,
                    dataType: "jsonp",
                    type: "GET",
                    data: {
                        term: request.term
                    },
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (item) {
                            return {
                                label: item.name,
                                value: item.name,
                                id: item.id,
                            };
                        }));
                    },
                    search: function (e, u) {
                        $(this).addClass('loader');
                    },
                    response: function (e, u) {
                        $(this).removeClass('loader');
                    },
                    error: function (xhr) {

                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                $.get('/customer/vendorbyid/' + ui.item.id, function (data) {
                    SALES.customer = JSON.parse(data);
                    $('#payment_due_date option[value="' + SALES.customer.payment_terms + '"]').prop('selected', true);
                    SALES.gstInit();
                    SALES.getShipping();
                });
                
            }
        });
        SALES.itemRow();
    },
    salesEditInit:function(comstate,cus,item,tax_slab){
        SALES.initSN(comstate,tax_slab);
        console.log(cus);
        SALES.customer = cus;
        SALES.hsn = item.hsn_code;
        SALES.gst = item.tax_slabe;
        SALES.gstInit();
        SALES.initRowElement();
        SALES.calculateAddPrice('on');
    },
    getShipping:function(){
        $.get('/customer/shipping/' + SALES.customer.id, function (data) {
            var sd = JSON.parse(data);
            var $ship=$('#shipping');
            $ship.empty();
            Object.keys(sd).forEach(function(k){
                if(k==0)
                    SALES.customer.state==sd[k].state;
                $ship.append($("<option></option>").attr("value", sd[k].id).text(sd[k].label));
            });
        });
    },
    itemRow: function () {
        var htm = '<div class="data-row-wrap" data-id="0">';
        htm += '<div class="col-md-4" style="float: left;">';
        htm += '<input type="text" placeholder="Enter product code" class="form-control i-r-prod"/>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="number" step=".01" class="form-control i-r-qnt" placeholder="Quantity" value="1">';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<select  class="form-control i-r-unit"></select>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="number" class="form-control i-r-price" step=".01" placeholder="Price" value="0">';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<input type="number" class="form-control i-r-dis" step=".01" placeholder="Discount(%)" value="0">';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<select class="form-control i-r-tax-slab">';
        for(var i in SALES.all_tax)
            htm += '<option value="'+SALES.all_tax[i]+'">'+SALES.all_tax[i]+' %</option>';
        htm += '</select>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;text-align: right;">';
        htm += '<span class="i-r-tax-tot">0.00</span>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;text-align: right;padding-right: 20px;">';
        htm += '<span class="i-r-tot">0.00</span>';
        htm += '</div>';
        htm += '<div class="col-md-1" style="float: left;">';
        htm += '<a class="btn btn-icon waves-effect waves-light btn-danger m-b-5 i-r-del"> <i class="fa fa-remove"></i> </a>';
        htm += '</div>';
        htm += '<div class="col-md-10" style="float: left;">';
        htm += '<span class="i-r-span" style="font-size:10px;"></span>';
        htm += '</div>';
        htm += '</div>';
        $(".item-wrapper").append(htm);
        SALES.initRow();
    },
    initRow: function () {

        $(".i-r-prod").autocomplete({
            source: function (request, response) {
				var data={term: request.term,
						hsn:-1};
                $.ajax({
                    url: "/item/autoitem",
                    type: "POST",
					data: JSON.stringify(data),
					contentType: 'application/json',
                    complete: function (data) {
                        response($.map(JSON.parse(data.responseText), function (item) {
                            return {
                                label: item.code+' ('+item.specification+')',
                                value: item.code+' HSN:'+item.hsn_code,
                                id: item.id,
                            };
                        }));
                    }
                });
            },
            minLength: 3,
            select: function (event, ui) {
                $.get('/item/itembyid/' + ui.item.id, function (data) {
                    data = JSON.parse(data);
                    var rw = event.target.closest(".data-row-wrap");
                    $(rw).attr('data-id', data.id);
                    var $unt = $(rw).find('.i-r-unit');
                    var $price = $(rw).find('.i-r-price');
                    var $span = $(rw).find('.i-r-span');
                    $unt.empty();
                    $unt.append($("<option></option>").attr("value", data.unit).text(data.unit));
                    if (data.unit_two != '')
                        $unt.append($("<option></option>").attr("value", data.unit_two).text(data.unit_two));
                    if (data.unit_three != '')
                        $unt.append($("<option></option>").attr("value", data.unit_three).text(data.unit_three));
                    $price.val(data.sales_rate);
                    $span.html(data.name+", "+data.specification);
                    $(rw).find('.i-r-tax-slab option[value="'+data.tax_slabe+'"]').prop('selected', true);
                    SALES.hsn = data.hsn_code;
                    SALES.gst = data.tax_slabe;
                    SALES.gstInit();
                    SALES.claculatePrice(rw);
                    SALES.initRowElement();
                    if($( ".data-row-wrap[data-id='0']" ).length==0)
                    SALES.itemRow();
                });
            }
        });
    },
    gstInit:function(){
        $(".s-a-cgst-a").html("0.00");
        $(".s-a-sgst-a").html("0.00");
        $(".s-a-igst-a").html("0.00");
    },
    initRowElement: function () {
        $(".i-r-qnt").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            SALES.claculatePrice(rw);
        });
        $(".i-r-price").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            SALES.claculatePrice(rw);
        });
        $(".i-r-dis").on("change paste keyup", function(){
            var rw = event.target.closest(".data-row-wrap");
            SALES.claculatePrice(rw);
        });
        $(".i-r-tax-slab").on("change paste keyup", function () {
            var rw = event.target.closest(".data-row-wrap");
            SALES.claculatePrice(rw);
        });
        $(".i-r-del").on("click", function (e) {
            if($(this).closest(".data-row-wrap").attr("data-id")!='0'){
                $( this ).closest( ".data-row-wrap" ).remove();
                var ni = $('.data-row-wrap').length;
                if(ni==1){
                    SALES.hsn = '-1';
                    SALES.gst = 0;
                }
                SALES.calculateAddPrice('off');
            }
        });
        
    },

    claculatePrice: function (el) {
        var id = parseInt($(el).attr('data-id'));
        if (id > 0) {
            var q1 = $(el).find('.i-r-qnt').val().trim(), p1 = $(el).find('.i-r-price').val().trim(), d1 = $(el).find('.i-r-dis').val().trim(),tax1=$(el).find('.i-r-tax-slab').val().trim();
            var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1), d = (d1 == "") ? 0 : parseFloat(d1), tax = (tax1 == "") ? 0 : parseFloat(tax1);
            var t1 = q * p;
            var t = t1 - ((t1 * d) / 100);
            var ttax = t*tax / 100;
            $(el).find(".i-r-tax-tot").html(ttax.toFixed(2));
            $(el).find(".i-r-tot").html((t+ttax).toFixed(2));
            SALES.calculateAddPrice('off');
        }
    },
    
    calculateAddPrice:function(preload){
        var st = 0,stt=0, count = $(".data-row-wrap").length;
        $(".data-row-wrap").each(function (i) {
            st += parseFloat($(this).find('.i-r-tot').html().trim());
            stt += parseFloat($(this).find('.i-r-tax-tot').html().trim());
            if (!--count) {
                $(".s-a-s-tot").html(st.toFixed(2));
                $(".s-a-s-tot-tax").html(stt.toFixed(2));
                var ct = $(".sa-field").length;
                $(".sa-field").each(function (i) {
                    if(preload=='off' && parseFloat($(this).attr('data-pct'))>0){
                        var af = ((st * parseFloat($(this).attr('data-pct'))) / 100);
                        $(this).val(af.toFixed(2));
                    }
                    var rw = $(this).closest(".safildwrap");
                    SALES.claculateSaFieldPrice(rw);
                    if (!--ct) {
                        SALES.calculateTotPrice();
                    }
                });
            }
        });
    },
    claculateSaFieldPrice: function (el) {
        var a1 = $(el).find('.sa-field').val().trim(), tax1 = $(el).find('.i-r-o-tax-slab').val().trim();
        var a = (a1 == "") ? 0 : parseFloat(a1), tax = (tax1 == "") ? 0 : parseFloat(tax1);
        var ttax = (a*tax / 100);
        $(el).find(".i-r-o-tax-tot").html(ttax.toFixed(2));
        $(el).find(".i-r-o-tot").html((a+ttax).toFixed(2));
        SALES.calculateTotPrice();
    },
    calculateTotPrice:function(){
        var st = parseFloat($(".s-a-s-tot").html()),stt = parseFloat($(".s-a-s-tot-tax").html()), ct = $(".safildwrap").length;
        $(".safildwrap").each(function (i) {
            st += parseFloat($(this).find('.i-r-o-tot').html());
            stt += parseFloat($(this).find('.i-r-o-tax-tot').html());
            if (!--ct) {
                $(".s-a-s-tot-2").html(st.toFixed(2));
                $(".s-a-s-tot-2-tax").html(stt.toFixed(2));
                $(".s-a-cgst-a").html("0.00");
                $(".s-a-sgst-a").html("0.00");
                $(".s-a-igst-a").html("0.00");
                if (typeof SALES.customer.state !== 'undefined' && stt > 0 && SALES.customer.gst_applicable == 'yes') {
                    //var gst = (st * PURCHASE.gst / 100);
                    if (SALES.comstate == SALES.customer.state) {
                        $(".s-a-cgst-a").html((stt / 2).toFixed(2));
                        $(".s-a-sgst-a").html((stt / 2).toFixed(2));
                    } else {
                        $(".s-a-igst-a").html(stt.toFixed(2));
                    }
                    //st += gst;
                }
                $(".s-a-totr").html(st.toFixed(2));
                var round = -(st - Math.round(st));
                $(".s-a-round").html(round.toFixed(2));
                $(".s-a-tot").html(Math.round(st).toFixed(2));
            }
        });
    },

    submitSNewFrm: function () {
        $("body").css('cursor', 'wait');
        $(".loginmessage").html('Data submiting. Please Wait...');
        var itm=[],saf=[],totdis=0;
        $( ".data-row-wrap" ).each(function( i ) {
            var id = parseInt($(this).attr('data-id'));
            if(id>0){
                var q1 = $(this).find('.i-r-qnt').val().trim(), p1 = $(this).find('.i-r-price').val().trim(), d1 = $(this).find('.i-r-dis').val().trim(), u = $(this).find('.i-r-unit').val().trim();
                var q = (q1 == "") ? 0 : parseFloat(q1), p = (p1 == "") ? 0 : parseFloat(p1), d = (d1 == "") ? 0 : parseFloat(d1);
                var t = $(this).find(".i-r-tot").html(),tx=parseFloat($(this).find('.i-r-tax-tot').html().trim()),ts=parseFloat($(this).find('.i-r-tax-slab').val().trim());
                itm.push({id: id, q: q, u: u, p: p, t: t, d: d,tx:tx,ts:ts});
                totdis += d;
            }
        });
        $(".safildwrap").each(function (i) {
            var id = parseInt($(this).attr('data-said'));
            if (id > 0) {
                saf.push({id: id, acc: $(this).attr('data-saacc'), v: parseFloat($(this).find('.sa-field').val().trim()),ts: parseFloat($(this).find('.i-r-o-tax-slab').val().trim()),tx: parseFloat($(this).find('.i-r-o-tax-tot').html().trim())});
            }
        });
        
        var data = {customer: SALES.customer.id,
            bill_date: $("#bill_date").val(),
            payment_due_date: $("#payment_due_date").val(),
            bill_no: $("#bill_no").val(),
            sales_note: $("#sales_note").val(),
            salesunit: $("#salesunit").val(),
            shipping: $("#shipping").val(),
            p_terms_note: $("#p_terms_note").val(),
            ref_no: $("#ref_no").val(),
            total_amount: parseFloat($(".s-a-tot").html()),
            cgst: parseFloat($(".s-a-cgst-a").html()),
            sgst: parseFloat($(".s-a-sgst-a").html()),
            igst: parseFloat($(".s-a-igst-a").html()),
            total_sub: parseFloat($(".s-a-s-tot").html()),
//            slab: SALES.gst,
            item: itm,
            saf:saf,
            round:parseFloat($(".s-a-round").html()),
            sid: $("#sid").val(),
            total_dis:totdis
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/sales/save',
            complete: function (xhr) {
                var res = JSON.parse(xhr.responseText);
                if (res.code > 0) {
                    $('#mainContent').html("<div class='loading'></div>");
                    $.get("/sales/bill/"+res.code, function (data) {
                        
                        $('#mainContent').html(data);
                        var msg = '';
                        if ($("#iid").val() !== 'undefined')
                            msg = 'Sales updated successfully!!!';
                        else
                            msg = 'Sales created successfully!!!';
                        COMMON.shownotification('success', msg);
                    });
                } else {
                    COMMON.shownotification('error', 'Unable to save sales!!!');
                }
                $(".loginmessage").html('');
                $("body").css('cursor', 'default');
            },
        });
    },
    initTaxInvoice: function () {
        SALES.getInvoiceBody($("#sid").val());
        $(".select2").select2();
        $(".btn-cncl").on("click", function (e) {
            location.reload();
        });
        $(".btn-p-OS").on("click", function (e) {
            COMMON.printContent(SALES.print);
        });
        $(".btn-pdf").on("click", function (e) {
            COMMON.printPdf($("#itemWrap"),"Tax-Invoice");
        });
        $(".btn-p-OS-save").on("click", function (e) {
            SALES.submitBillata();
        });
        $(".custom-modal-button").on("click", function (e) {
            COMMON.loadCustomModal(this,SALES.getWorkOrder);
        });
        $(".custom-modal-button-t").on("click", function (e) {
            COMMON.loadCustomModal(this,SALES.getTransport);
        });
        $(".custom-modal-button-p").on("click", function (e) {
            COMMON.loadCustomModal(this,SALES.getPacking);
        });
        
    },
    getTransport:function(){
        $.get('/transport/bycompany' , function (data) {
            var sd = JSON.parse(data);
            var $ship=$('#transport');
            $ship.empty();
            $ship.append($("<option></option>").attr("value", "").text(""));
            Object.keys(sd).forEach(function(k){
                $ship.append($("<option></option>").attr("value", sd[k].id).text(sd[k].title));
            });
        });
    },
    getPacking:function(){
        $.get('/packing/bycompany' , function (data) {
            var sd = JSON.parse(data);
            var $ship=$('#packing');
            $ship.empty();
            $ship.append($("<option></option>").attr("value", "").text(""));
            Object.keys(sd).forEach(function(k){
                $ship.append($("<option></option>").attr("value", sd[k].id).text(sd[k].listno));
            });
        });
    },
    getWorkOrder:function(){
        $.get('/sales_workorder/byid/' + $(".custom-modal-button").attr("data-id"), function (data) {
            var sd = JSON.parse(data);
            var $ship=$('#work_order');
            $ship.empty();
            $ship.append($("<option></option>").attr("value", "").text(""));
            Object.keys(sd).forEach(function(k){
                $ship.append($("<option></option>").attr("value", sd[k].id).text(sd[k].order_no));
            });
        });
    },
    getInvoiceBody:function(id){
        $.get('/sales/billbody/' + id, function (data) {
            SALES.print=data;
            $('#itemWrap').html(data);
        });
    },
    
    submitBillata: function () {
        $("body").css('cursor', 'wait');
        
        var data = {
            rcharge: $("#rcharge").val(),
            work_order: $("#work_order").val(),
            transport: $("#transport").val(),
            booking_station: $("#booking_station").val(),
            receiving_station: $("#receiving_station").val(),
            enclosure: $("#enclosure").val(),
            packing: $("#packing").val(),
            sid: $("#sid").val()
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/sales/savebill',
            complete: function (xhr) {
                SALES.getInvoiceBody($("#sid").val());
                $("body").css('cursor', 'default');
                COMMON.shownotification('success','Invoice data updated successfully!!!');
            },
        });
    },
};