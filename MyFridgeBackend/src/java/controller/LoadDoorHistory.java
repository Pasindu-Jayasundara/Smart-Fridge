package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import dto.Response_DTO;
import entity.Door_status;
import entity.Fridge;
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
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadDoorHistory", urlPatterns = {"/LoadDoorHistory"})
public class LoadDoorHistory extends HttpServlet {

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
            
            Criteria doorCriteria = hibernateSession.createCriteria(Door_status.class);
            doorCriteria.add(Restrictions.eq("fridge", fridge));
            List<Door_status> doorStatusList = doorCriteria.list();
            
            if(!doorStatusList.isEmpty()){
                
                JsonArray jsonArray = new JsonArray();
                for (Door_status doorStatus : doorStatusList) {
                    
                    JsonObject jo = new JsonObject();
                    jo.add("date", gson.toJsonTree(doorStatus.getDate()));
                    jo.addProperty("times", doorStatus.getTimes());
                    
                    jsonArray.add(jo);
                }
                replyObj.add("array", jsonArray);
            }
            
        }else{
            isSuccess=false;
        }
        
        hibernateSession.close();
        
        Response_DTO response_DTO = new Response_DTO(isSuccess, gson.toJsonTree(replyObj));
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));
        
        
    }

}
