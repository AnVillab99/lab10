package edu.eci.arsw.collabpaint.controller;


import java.util.concurrent.atomic.AtomicReferenceArray;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.arsw.collabpaint.model.Point;
import edu.eci.arsw.collabpaint.model.polygon;

@Controller
public class interceptor {
    AtomicReferenceArray <polygon> polygons = new AtomicReferenceArray<>(100);

    @Autowired
    SimpMessagingTemplate msg;

    @MessageMapping("/newpoint.{room}")
    public void handlePointEvent(Point pt, @DestinationVariable String room) throws Exception {
        System.out.println(room);
        int sala = Integer.parseInt(room);
        try{
        if(polygons.get(sala).equals(null)){
            polygons.lazySet(sala, new polygon());
            polygons.get(sala).addPoint(pt);
            msg.convertAndSend("/topic/newpoint."+room,pt);

        }
        else{
            polygon pol = polygons.get(sala);
            if(pol.getNumberOfPoints()==3){
                msg.convertAndSend("/topic/newpolygon."+room,pol.getPoints());
                polygons.set(sala, new polygon());
                

            }
            else{
                pol.addPoint(pt);
                msg.convertAndSend("/topic/newpoint."+room,pt);
                
            }
        }
    }

        catch(Exception e){
            polygons.lazySet(sala, new polygon());
            polygons.get(sala).addPoint(pt);
            msg.convertAndSend("/topic/newpoint."+room,pt);

        }
        
     

    }
}