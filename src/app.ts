// abstract library
import { DrawingCommon } from './common';
import * as THREE from 'three'
import { Mesh } from 'three';

import Easing from './easing'

const ANIMX = -1.5
const ANIMSPEED = 3

// A class for our application state and functionality
class Drawing extends DrawingCommon {

    constructor (canv: HTMLElement) {
        super (canv)
        // @ts-ignore
        this.animatedMesh = this.scene.animatedMesh
    }

    //@ts-ignore  because this is initialized in initializeScene, which is called from the 
    // superclass constructor
    animatedMesh: THREE.Mesh;

    /*
	Set up the scene during class construction
	*/
	initializeScene(){
        const objectRoot = new THREE.Group();

        var geometry: THREE.BufferGeometry = new THREE.CylinderGeometry( 0, 0.3, 1, 10, 1 );
        var material = new THREE.MeshStandardMaterial( { color: 0x00ffff, flatShading: true } );
        var mesh = new THREE.Mesh( geometry, material );

        mesh.position.set(0,0,1);
        objectRoot.add( mesh );

        geometry = new THREE.SphereGeometry( 0.2, 10, 10 );
        material = new THREE.MeshStandardMaterial( { color: 0xffff00, flatShading: false } );
        mesh = new THREE.Mesh( geometry, material );

        mesh.position.set(ANIMX,0,0);
        objectRoot.add( mesh );

        // @ts-ignore
        this.scene.animatedMesh = mesh

        this.scene.add( objectRoot );
    }

    animating = false   // first time in, we grab the time as a start time

    animSpeed = ANIMSPEED   // meters per second
    animDist = -2*ANIMX     // distance of our transition

    animLengthTime = 1000 * Math.abs(2*ANIMX) / ANIMSPEED   // time for the animation

    animStart = 0       // start and end time of this transition, based on speed and distance
    animEnd = 0

    animStartX = ANIMX  // start and end x position
    animEndX = -ANIMX
    
	/*
	Update the scene during requestAnimationFrame callback before rendering
	*/
	updateScene(time: DOMHighResTimeStamp){
        // set up the first time
        if (!this.animating) {
            this.animating = true
            this.animStart = time;
            this.animEnd = this.animStart + this.animLengthTime
        }

        // if we've exceeded the motion time, flip the direction, and
        // and set the motion time to be the next interval 
        if (time > this.animEnd) {
            this.animStart = this.animEnd;
            this.animEnd = this.animStart + this.animLengthTime
            this.animStartX *= -1
            this.animEndX *= -1
            this.animDist *= -1
        }

        // t goes from 0..1 over the time interval
        var t = (time - this.animStart) / this.animLengthTime  

        // get the position along the line
        this.animatedMesh.position.x = this.animStartX + t * this.animDist
    }
}

// a global variable for our state.  We implement the drawing as a class, and 
// will have one instance
var myDrawing: Drawing;

// main function that we call below.
// This is done to keep things together and keep the variables created self contained.
// It is a common pattern on the web, since otherwise the variables below woudl be in 
// the global name space.  Not a huge deal here, of course.

function exec() {
    // find our container
    var div = document.getElementById("drawing");

    if (!div) {
        console.warn("Your HTML page needs a DIV with id='drawing'")
        return;
    }

    // create a Drawing object
    myDrawing = new Drawing(div);
}

exec()