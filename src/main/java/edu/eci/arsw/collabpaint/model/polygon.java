package edu.eci.arsw.collabpaint.model;

import java.util.List;
import java.util.ArrayList;

public class polygon {

    List<Point> points = new ArrayList<>();

    public polygon() {

    }


    public void addPoint(Point pt){
        this.points.add(pt);
    }

    public int getNumberOfPoints(){
        return points.size();
    }

    public void resetPoints(){
        points.clear();
    }

    /**
     * @return the points
     */
    public List<Point> getPoints() {
        return points;
    }

    /**
     * @param points the points to set
     */
    public void setPoints(List<Point> points) {
        this.points = points;
    }

    



    
}