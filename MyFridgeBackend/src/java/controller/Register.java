package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.Response_DTO;
import entity.Door_status;
import entity.Food_status;
import entity.Fridge;
import entity.Humidity;
import entity.Rack_number;
import entity.Rack_weight;
import entity.Tempreature;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.jasypt.util.password.StrongPasswordEncryptor;

@WebServlet(name = "Register", urlPatterns = {"/Register"})
public class Register extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String fridgeCode = (String) request.getAttribute("fridgeCode");
        String password = (String) request.getAttribute("password");

        String message = "";
        boolean isSuccess = false;

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        Gson gson = new Gson();

        Criteria fridgeCriteria = hibernateSession.createCriteria(Fridge.class);
        fridgeCriteria.add(Restrictions.eq("code", fridgeCode));
        Fridge fridge = (Fridge) fridgeCriteria.uniqueResult();

        if (fridge != null) {

            isSuccess = true;
            message = "You Have Already Registerd. Please Login to Your Account";

        } else {

            String encryptedPassword = new StrongPasswordEncryptor().encryptPassword(password);

            // fridge
            Fridge newFridge = new Fridge();
            newFridge.setCode(fridgeCode);
            newFridge.setDatetime(new Date());
            newFridge.setPassword(encryptedPassword);
            newFridge.setIsOn(true);

            hibernateSession.save(newFridge);

            //tempreature
            Tempreature newTemp = new Tempreature();
            newTemp.setFridge(newFridge);
            newTemp.setTemp(0.0);

            hibernateSession.save(newTemp);
            
            //humidity
            Humidity newHumidity = new Humidity();
            newHumidity.setFridge(newFridge);
            newHumidity.setHumidity(0.0);

            hibernateSession.save(newHumidity);
            
            // door
            Door_status newDoorStatus = new Door_status();
            newDoorStatus.setIs_door_open(false);
            newDoorStatus.setFridge(newFridge);
            newDoorStatus.setTimes(0);
            newDoorStatus.setDate(new Date());
            
            hibernateSession.save(newDoorStatus);
            
            // food
            Food_status newFoodStatus = new Food_status();
            newFoodStatus.setFood_status(0);
            newFoodStatus.setFridge(newFridge);
            
            hibernateSession.save(newFoodStatus);
            
            // rack weight
            Rack_number racknum1 = (Rack_number) hibernateSession.get(Rack_number.class, 1);
            
            Rack_weight newRack_1_weight = new Rack_weight();
            newRack_1_weight.setFridge(newFridge);
            newRack_1_weight.setWeight(0.0);
            newRack_1_weight.setRack_number(racknum1);
            
            hibernateSession.save(newRack_1_weight);
            hibernateSession.beginTransaction().commit();
            
            isSuccess = true;
            message = "Registration Success. Please Login to Your Account";
            
        }

        hibernateSession.close();
        
        Response_DTO response_DTO = new Response_DTO(isSuccess, message);
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));

    }

}
