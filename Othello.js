const readline = require('readline');
const userInput = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class OthelloBoard{
    constructor(){
        /// Random for First Player and Create board
        this.current_player = ["O","X"][Math.floor(Math.random()*2)];
        this.board = [["B","B","B","B","B","B","B","B","B","B"],
                    ["B","N","N","N","N","N","N","N","N","B"],
                    ["B","N","N","N","N","N","N","N","N","B"],
                    ["B","N","N","N","N","N","N","N","N","B"],
                    ["B","N","N","N","O","X","N","N","N","B"],
                    ["B","N","N","N","X","O","N","N","N","B"],
                    ["B","N","N","N","N","N","N","N","N","B"],
                    ["B","N","N","N","N","N","N","N","N","B"],
                    ["B","N","N","N","N","N","N","N","N","B"],
                    ["B","B","B","B","B","B","B","B","B","B"]];
        console.log(`Game Start\nBlack : X || White : O`);
        this.game();
    }

    game(){
        let availableMove = this.checkAllBoard();
        if (availableMove.length>0){
            this.showBoard(availableMove);
            console.log(`Current Player : ${this.showPlayer(this.current_player)}`);
            console.log(`${this.showPlayer(this.current_player)}'s available move(s) : `, availableMove);
            let userInput = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });     
            userInput.question("What is your next move: ", (answer) => {
                let ansMove;
                try {ansMove = JSON.parse(answer);}
                catch{console.log("Invalid input. Please input in form \"[Y, X]\"");
                    userInput.close();
                    this.game();
                    return;
                }
                let trueMove = [ansMove[0], ansMove[1]]
                if (availableMove.some(move => move[0] === trueMove[0] && move[1] === trueMove[1])){
                    this.makemove(ansMove);
                    this.switchPlayer();
                    userInput.close();
                    this.game();
                }
                else{
                    console.log("Invalid Input");
                    userInput.close();
                    this.game();
                }               
            });
        }
        else{
            this.switchPlayer()
            if (this.checkAllBoard().length > 0){
                this.game();
            }
            else{
                let score = this.calculateScore();
                console.log(`Game Over: White - ${score[0]} : Black ${score[1]}`);
            }
        }
    }

    calculateScore(){
        let scorewhite = 0;
        let scoreblack = 0;
        for(let row = 1; row<9; row++){
            for(let column = 1; column<9; column++){
                let unit = this.board[row][column]
                if(unit == "O"){
                    scorewhite++;
                }
                else if (unit == "X"){
                    scoreblack++;
                }
            }
        }
        return [scorewhite, scoreblack];
    }

    makemove(move){
        let [y,x] = move;
        let opponent = this.opponent(this.current_player);
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                if (i === 0 && j === 0) {
                    continue;
                }
                let toChange = [];
                let currentCheckX = x + j;
                let currentCheckY = y + i;
                let enemyInbetween = false;
                
                if (currentCheckY < 1 || currentCheckY > 8 || currentCheckX < 1 || currentCheckX > 8) {
                    continue;
                }
    
                while (this.board[currentCheckY][currentCheckX] === opponent) {
                    enemyInbetween = true;
                    toChange.push([currentCheckY, currentCheckX]);
                    currentCheckX += j;
                    currentCheckY += i;
                    
                    if (currentCheckY < 1 || currentCheckY > 8 || currentCheckX < 1 || currentCheckX > 8) {
                        break;
                    }
                }
    
                if (enemyInbetween && this.board[currentCheckY][currentCheckX] === this.current_player) {
                    for (let k = 0; k < toChange.length; k++) {
                        let changePos = toChange[k];
                        this.board[changePos[0]][changePos[1]] = this.current_player;
                    }
                }
            }
        }
        // Set the current move
        this.board[y][x] = this.current_player;
    }

    checkAvailable(axis){
        /// check if the axis location is available for current player, available ? true : false
        let [original_y, original_x] = axis;
        let opponent = this.opponent(this.current_player);
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                let currentCheckX = original_x;
                let currentCheckY = original_y;
                let enemyInbetween = false;
                while(this.board[currentCheckY+i][currentCheckX+j]==opponent){
                    enemyInbetween = true;
                    currentCheckX = currentCheckX+j;
                    currentCheckY = currentCheckY+i;
                }
                if ((this.board[currentCheckY+i][currentCheckX+j] == this.current_player) & enemyInbetween){
                    return true;
                }
            }
        }
    }

    checkAllBoard(){
        /// check all available for this player and return array for available move
        let available = [];
        for (let row = 1; row < 9; row++){
            for (let column = 1; column < 9; column++){
                if (this.board[row][column]=="N"){                    
                    if (this.checkAvailable([row,column])){
                        available.push([row,column]);
                    }
                }
            }
        }
        return available;
    }

    opponent(player){
        ///return opposite player
        return player === "O" ? "X" : "O";
    }

    switchPlayer(){
        ///switch current player
        this.current_player = this.opponent(this.current_player);
    }

    showPlayer(player){
        ///convert current player to Black/White
        return player === "X" ? "Black" : "White";
    }

    showBoard(allAvailableMove){
        ///Show board in terminal
        let vs = "+ 1 2 3 4 5 6 7 8\n"
        for (let row = 1; row < 9; row++){
            vs = vs + `${row} `
            for (let column = 1; column < 9; column++){
                let stat = this.board[row][column];           
                if (allAvailableMove.some(availableMove => availableMove[0] === row && availableMove[1] === column)) {stat = "!";}
                else if (stat == "N"){stat = "#";}
                vs = vs + stat + " ";
            }
            vs = vs + "\n";
        }
        console.log(vs);
    }
}

let othello = new OthelloBoard();