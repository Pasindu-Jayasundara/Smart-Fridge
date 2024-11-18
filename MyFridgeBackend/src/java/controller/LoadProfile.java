package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.Response_DTO;
import entity.Door_status;
import entity.Food_status;
import entity.Fridge;
import entity.Power_consumption;
import entity.Rack_weight;
import entity.Tempreature;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadProfile", urlPatterns = {"/LoadProfile"})
public class LoadProfile extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String fridgeCode = (String) request.getAttribute("fridgeCode");

        Gson gson = new Gson();
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        JsonObject replyObj = new JsonObject();

        boolean isSuccess = true;
        
        Criteria fridgeCriteria = hibernateSession.createCriteria(Fridge.class);
        fridgeCriteria.add(Restrictions.eq("code", fridgeCode));
        Fridge fridge = (Fridge) fridgeCriteria.uniqueResult();

        if (fridge != null) {
            
            // rack weight
            Criteria rackWeightCriteria = hibernateSession.createCriteria(Rack_weight.class);
            rackWeightCriteria.add(Restrictions.eq("fridge", fridge));
            List<Rack_weight> rackWeightList = rackWeightCriteria.list();
            if (!rackWeightList.isEmpty()) {

                JsonObject rackWeightObj = new JsonObject();
                for (Rack_weight rack_weight : rackWeightList) {
                    if (rack_weight.getRack_number().getRack_number() == 1) {

                        JsonObject rackOne = new JsonObject();
                        rackOne.addProperty("weight", rack_weight.getWeight());

                        rackWeightObj.add("rackOne", gson.toJsonTree(rackOne));

                    } else {
                        JsonObject rackTwo = new JsonObject();
                        rackTwo.addProperty("weight", rack_weight.getWeight());

                        rackWeightObj.add("rackTwo", gson.toJsonTree(rackTwo));
                    }
                }
                replyObj.add("rackWeight", rackWeightObj);
            }

            // power consumption
            Criteria powerConsumptionCriteria = hibernateSession.createCriteria(Power_consumption.class);
            powerConsumptionCriteria.add(Restrictions.eq("fridge", fridge));
            powerConsumptionCriteria.addOrder(Order.desc("date"));
            powerConsumptionCriteria.setMaxResults(1);
            Power_consumption powerConsumption = (Power_consumption) powerConsumptionCriteria.uniqueResult();

            if (powerConsumption != null) {

                JsonObject powerConsumptionObj = new JsonObject();
                powerConsumptionObj.add("date", gson.toJsonTree(powerConsumption.getDate()));
                powerConsumptionObj.addProperty("power", powerConsumption.getPower());

                replyObj.add("powerConsumption", powerConsumptionObj);
            }

            // door status
            Criteria doorStatusCriteria = hibernateSession.createCriteria(Door_status.class);
            doorStatusCriteria.add(Restrictions.eq("fridge", fridge));
            doorStatusCriteria.addOrder(Order.desc("date"));
            doorStatusCriteria.setMaxResults(1);
            Door_status doorStatus = (Door_status) doorStatusCriteria.uniqueResult();

            if (doorStatus != null) {

                JsonObject doorStatusObj = new JsonObject();
                doorStatusObj.add("date", gson.toJsonTree(doorStatus.getDate()));
                doorStatusObj.addProperty("times", doorStatus.getTimes());
                doorStatusObj.addProperty("isNowOpen", doorStatus.isIs_door_open());

                replyObj.add("doorStatus", doorStatusObj);
            }

            // food status
            Criteria foodStatusCriteria = hibernateSession.createCriteria(Food_status.class);
            foodStatusCriteria.add(Restrictions.eq("fridge", fridge));
            foodStatusCriteria.setMaxResults(1);
            Food_status foodStatus = (Food_status) foodStatusCriteria.uniqueResult();

            if (foodStatus != null) {

                JsonObject foodStatusObj = new JsonObject();
                foodStatusObj.addProperty("foodStatus", foodStatus.getFood_status());

                replyObj.add("foodStatus", foodStatusObj);
            }

            // tempreature
            Criteria tempreatureCriteria = hibernateSession.createCriteria(Tempreature.class);
            tempreatureCriteria.add(Restrictions.eq("fridge", fridge));
            tempreatureCriteria.setMaxResults(1);
            Tempreature tempreature = (Tempreature) tempreatureCriteria.uniqueResult();

            if (tempreature != null) {

                JsonObject tempreatureObj = new JsonObject();
                tempreatureObj.addProperty("tempreature", tempreature.getTemp());

                replyObj.add("tempreature", tempreatureObj);
            }

        }else{
            isSuccess = false;
        }
        hibernateSession.close();
        
        Response_DTO response_DTO = new Response_DTO(isSuccess, gson.toJsonTree(replyObj));
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));
    }

}
