/**
 * Created by Владимир on 15.11.2014.
 */

var boxes = new Array(0), linkBoxes, prevBoxes, arrLink ;
var remState = 1, remStyle = 1 ;
var idGen = 0 ;

(function(){
    arrLink = new Array(4) ;
    for( var i = 0 ; i < 4 ; ++i )
        arrLink[i] = new Array(4) ;
})() ;

function Link(x,y,value,ncreate)
{
    this.x = x ;
    this.y = y ;
    this.value = value ;
    this.ncreate = ncreate ;
    this.created = 0 ;
}

function addAnimation(i,j){
    //
}

function Box( gen, i, j, val )
{
    this.mid = idGen + "" ; ++idGen ;
    this.x = j ; this.y = i ;
    this.value = 0 ;
    if( !gen ) {
        if( Math.random() > 0.7 )
            this.value = 4 ;
        else
            this.value = 2 ;
    }
    else if( gen == 1 )
        this.value = val ;

    var newItem = document.createElement("div") ;
    var textNode = document.createTextNode(""+this.value) ;
    newItem.appendChild( textNode ) ;
    newItem.classList.add("td") ; newItem.classList.add("t"+(j+1)+""+(i+1)) ;
    newItem.id = this.mid ;

    var logval = this.value?Math.log(this.value)/Math.log(2):0 ;
    if (remState == 1)
        newItem.style.background = "rgb(" + (248 - 12 * logval) + "," +  (248 - 12 * logval) + "," + (logval > 5 ? 248 - 12 * (logval - 5) : 248) + ")";
    else if (remState == 2)
        newItem.style.background = "rgb(" + (logval > 5 ? 248 - 4 * (logval - 5) : 248) + "," + (248 - 4 * logval) + "," + (logval?248 - 16 * logval:248) + ")";
    else if (remState == 3)
        newItem.style.background = "rgb(" + (248 - 8 * logval) + "," + (logval > 5 ? 248 - 8 * (logval - 5) : 248) + "," + (248 - 16 * logval) + ")";

    document.body.getElementsByClassName("board")[0].appendChild( newItem ) ;

    /*animation*/
    var self = this ;

    this.mupdate = function(nx,ny) {
        document.getElementById( this.mid ).classList.remove("t"+(this.x+1)+""+(this.y+1)) ;
        document.getElementById( this.mid ).classList.add("t"+(nx+1)+""+(ny+1)) ;
        this.x = nx ; this.y = ny ;
    } ;

    this.mpushndel = function(nx,ny) {
        document.getElementById( this.mid ).classList.remove("t"+(this.x+1)+""+(this.y+1)) ;
        document.getElementById( this.mid ).classList.add("t"+(nx+1)+""+(ny+1)) ;
        this.x = nx ; this.y = ny ;
        var self = this ; setTimeout( function(){ self.mdelete() ; }, 50 ) ;
    } ;

    this.mdelete = function() {
        document.body.getElementsByClassName("board")[0].removeChild( document.getElementById( self.mid ) ) ;
    } ;

    return this ;
}

function turnAppear(val)
{
    do {
        i = Math.round(Math.random()*3);
        j = Math.round(Math.random()*3);
    }while( linkBoxes[i][j] ) ;
    if( val )
        boxes.push( new Box(1,i,j,val ) ) ;
    else
        boxes.push( new Box(0,i,j) ) ;
    linkBoxes[i][j] = boxes[ boxes.length - 1 ] ;
}

function handleVert( si, fi, di ) {
    var something = 0 ;
    for( var j = 0 ; j < 4 ; ++j ) {
        var lasti = undefined, lastei = undefined;
        for (var i = si ; i != fi ; i += di) {
            if (lastei == undefined && linkBoxes[i][j] && ( lasti == undefined || linkBoxes[i][j].value != linkBoxes[lasti][j].value )) //(1)
                lasti = i;
            else if (lastei == undefined && !linkBoxes[i][j]) //(2)
                lastei = i;
            else if (lasti != undefined && linkBoxes[i][j] && linkBoxes[lasti][j].value == linkBoxes[i][j].value) { //(3)
                boxes.splice(boxes.indexOf(linkBoxes[lasti][j]), 1);
                linkBoxes[lasti][j].mdelete();
                delete linkBoxes[lasti][j];
                boxes.push(new Box(1, lasti, j, linkBoxes[i][j].value * 2));
                linkBoxes[lasti][j] = boxes[boxes.length - 1];
                boxes.splice(boxes.indexOf(linkBoxes[i][j]), 1);
                linkBoxes[i][j].mpushndel(j, lasti);
                delete linkBoxes[i][j];
                lastei = lasti + di ;
                lasti = undefined;
                something = 1;
            }
            else if (lastei != undefined && linkBoxes[i][j]) { //4
                linkBoxes[i][j].mupdate(j, lastei);
                linkBoxes[lastei][j] = linkBoxes[i][j] ;
                delete linkBoxes[i][j] ;
                lasti = lastei;
                lastei += di ;
                something = 1;
            }
        }
    }
    if( something )
        turnAppear() ;
}

function handleHoriz( sj, fj, dj ) {
    var something = 0 ;
    for( var i = 0 ; i < 4 ; ++i ) {
        var lastj = undefined, lastej = undefined;
        for (var j = sj ; j != fj ; j += dj) {
            if (lastej == undefined && linkBoxes[i][j] && ( lastj == undefined || linkBoxes[i][j].value != linkBoxes[i][lastj].value )) //(1)
                lastj = j;
            else if (lastej == undefined && !linkBoxes[i][j]) //(2)
                lastej = j;
            else if (lastj != undefined && linkBoxes[i][j] && linkBoxes[i][lastj].value == linkBoxes[i][j].value) { //(3)
                boxes.splice(boxes.indexOf(linkBoxes[i][lastj]), 1);
                linkBoxes[i][lastj].mdelete();
                delete linkBoxes[i][lastj];
                boxes.push(new Box(1, i, lastj, linkBoxes[i][j].value * 2));
                linkBoxes[i][lastj] = boxes[boxes.length - 1];
                boxes.splice(boxes.indexOf(linkBoxes[i][j]), 1);
                linkBoxes[i][j].mpushndel(lastj, i);
                delete linkBoxes[i][j];
                lastej = lastj + dj ;
                lastj = undefined;
                something = 1;
            }
            else if (lastej != undefined && linkBoxes[i][j]) { //4
                linkBoxes[i][j].mupdate(lastej, i);
                linkBoxes[i][lastej] = linkBoxes[i][j] ;
                delete linkBoxes[i][j] ;
                lastj = lastej;
                lastej += dj ;
                something = 1;
            }
        }
    }
    if( something )
        turnAppear() ;
}

function changeCol(state) {
    remState = state ;
    for( i = 0 ; i < boxes.length ; ++i ){
        var logval = boxes[i].value?Math.log(boxes[i].value)/Math.log(2):0 ;
        if (state == 1)
            document.getElementById(boxes[i].mid).style.background = "rgb(" + (248 - 12 * logval) + "," +  (248 - 12 * logval) + "," + (logval > 5 ? 248 - 12 * (logval - 5) : 248) + ")";
        else if (state == 2)
            document.getElementById(boxes[i].mid).style.background = "rgb(" + (logval > 5 ? 248 - 4 * (logval - 5) : 248) + "," + (248 - 4 * logval) + "," + (logval?248 - 16 * logval:248) + ")";
        else if (state == 3)
            document.getElementById(boxes[i].mid).style.background = "rgb(" + (248 - 8 * logval) + "," + (logval > 5 ? 248 - 8 * (logval - 5) : 248) + "," + (248 - 16 * logval) + ")";
    }
    if (state == 1){
        document.body.style.backgroundColor = "lightblue" ;
        document.body.getElementsByClassName("board")[0].style.backgroundColor = "slateblue" ;
    } else if (state == 2){
        document.body.style.backgroundColor = "khaki" ;
        document.body.getElementsByClassName("board")[0].style.backgroundColor = "gainsboro" ;
    } else if (state == 3){
        document.body.style.backgroundColor = "lightgreen" ;
        document.body.getElementsByClassName("board")[0].style.backgroundColor = "palegreen" ;
    }
}


function changeStyle(state) {
    remStyle = state ;
    if( state == 1 ){
        //document.body.style.background = "url('assets/images/background-lines-big.png') 0 0 repeat" ;
        document.body.style.backgroundPosition="15px 0,15px 0,0 0, 0 0" ;
        document.body.style.backgroundSize="30px 20px" ;
    }
    else if( state == 2 ){
        //document.body.style.background = "url('assets/images/background-squares-big.png') 0 0 repeat" ;
        document.body.style.backgroundPosition="0 0" ;
        document.body.style.backgroundSize="10px 10px" ;
    }
}

var lastClick = 0, curClick ;
function setKeysHandle(){
    document.onkeydown = function(e){
        curClick = new Date ;
        if( curClick - lastClick > 100 ) {
            lastClick = curClick ;
            if (e.keyCode == 37)
                handleHoriz(0, 4, 1);
            else if (e.keyCode == 38)
                handleVert(0, 4, 1);
            else if (e.keyCode == 39)
                handleHoriz(3, -1, -1);
            else if (e.keyCode == 40)
                handleVert(3, -1, -1);
            /*if( !handleHoriz(0, 4, 1, 1) && !handleHoriz(3, -1, -1, 1) && !handleVert(0, 4, 1, 1) && !handleVert(3, -1, -1, 1) )
                gameOver() ;*/
        }
    }
}

function undoAct()
{
    /*if( prevBoxes ) {
        for( i = 0 ; i < 4 ; ++i ){
            for( j = 0 ; j < 4 ; ++j ){
                boxes[i][j] = new Box(3,i,j,prevBoxes[i][j].value);
            }
        }
        prevBoxes = undefined ;
    }
    setKeysHandle();
    */
}

function gameOver(){
    alert( "Game Over!" ) ;
    document.onkeypress = undefined ;
}

function RestartGame(){
    prevBoxes = undefined ;
    while( boxes.length ) {
        boxes[0].mdelete();
        boxes.shift();
    }
    linkBoxes = new Array(4);
    for (var i = 0; i < 4; ++i) {
        linkBoxes[i] = new Array(4);
        for (var j = 0; j < 4; ++j)
            linkBoxes[i][j] = null;
    }
    turnAppear(2) ; turnAppear(2) ;
    setKeysHandle();
    changeStyle(remStyle);
    changeCol(remState);
}

RestartGame();