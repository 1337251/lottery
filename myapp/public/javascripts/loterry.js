//区分奖项
var level = "";
function difPage(){
    var url = location.search;   
    if (url.indexOf("?") != -1) {  
        level = url.substr(7);
        $('#'+level).css('display','block');
    }
}
difPage();

//返回首页
function backHome(){
    window.history.back(-1);   
}

//初始化列表
var initList = [];
function getInitList () {
    var data = {
        number: 500
    }
    $.ajax({
        type: "GET",
        url: "/lottery/initList",
        data: data,
        success: function(result){
            initList = [];
            initList = result;
        }
     });
}
getInitList();
//滚动显示
function getRandNum(){
    if(level == 'third' || level == 'five') {
        var num1 = GetRnd(0,initList.length-1);
        var num2 = GetRnd(0,initList.length-1);
        document.getElementById(level + "_val_1").value = initList[num1].section + '  ' + initList[num1].name + initList[num1].number;
        document.getElementById(level + "_val_2").value = initList[num2].section + '  ' + initList[num2].name + initList[num2].number;
    }else if(level == 'six' || level == 'sunshine') {

    }else{
        var num = GetRnd(0,initList.length-1);
        document.getElementById(level + "_val").value = initList[num].section + '  ' + initList[num].name + initList[num].number;
    }
}
function GetRnd(min,max){
    randnum = parseInt(Math.random()*(max-min+1));
    return randnum;
}
//开始抽奖
var winner = []; 
function start(){
    $("#start").hide();
    if(level != 'six' && level != 'sunshine'){
        $("#stop").show();
    }
    timer = setInterval("getRandNum();",100);  
    var data = {
        number: 1,
        level: level
    };
    if(level == 'third' || level == 'five'){
        data = {
            number: 2,
            level: level
        }
    }else if(level == 'six') {
        data = {
            number: 100,
            level: level
        }
    }else if(level == 'sunshine') {
        data = {
            number: 700,
            level: level
        }
    }
    if($("#custom").val() != ""){
        data = {
            number: $("#custom").val(),
            level: level
        }
    }
    getResult(data, function(result){
        if(level != 'six' && level != 'sunshine') {
            winner = [];
            winner = result;
        }else {
            var i = 0,
            fun = setInterval(function() {
                if (i < 50) {
                    $('#' + level + '_val').append('<span>' + result[i].section + '  ' + result[i].name + result[i].number + '</span>'); 
                    i++;
                } else {
                    clearInterval(fun);
                    $("#stop").show();
                }
            },100);
        }
    });
}

//结束抽奖
function stop(){
    $("#stop").hide();
    $("#start").show();
    clearInterval(timer);
    if(level != 'six' && level != 'sunshine') {
        setValue();
    }
}
//获取数据
function getResult (data, callback) {
    $.ajax({
        type: "GET",
        url: "/lottery/winner",
        data: data,
        success: function(result){
            callback(result);
        }
    });
}
function setValue() {
    if(level == 'third' || level == 'five') {
        document.getElementById(level + "_val_1").value = winner[0].section + '  ' + winner[0].name + winner[0].number;
        document.getElementById(level + "_val_2").value = winner[1].section + '  ' + winner[1].name + winner[1].number;
    }else if(level == 'six' || level == 'sunshine') {
        // winner.forEach(item => {
        //     $('#' + level + '_val').append('<span>' + item.section + '  ' + item.name + item.number + '</span>'); 
        // });
    }else{
        document.getElementById(level + "_val").value = winner[0].section + '  ' + winner[0].name + winner[0].number;
    }
}