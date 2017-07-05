function Obstacle(position, width, height) {

    this.position = position;
    this.width = width;
    this.height = height;

    this.draw = function () {
        stroke(0);
        fill(183);
        strokeWeight(1);
        rectMode(CORNER);
        rect(this.position.x, this.position.y, this.width - 10, this.height - 10);
    }

    this.contains = function (spot, radius) {
        if (spot.x > this.position.x && spot.x < this.position.x + width
            && spot.y > this.position.y && spot.y < this.position.y + height) {
            return true;
        } else {
            return false;
        }
    }

}