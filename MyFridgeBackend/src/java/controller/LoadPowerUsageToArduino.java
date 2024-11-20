package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.Response_DTO;
import entity.Door_status;
import entity.Food_status;
import entity.Fridge;
import entity.Humidity;
import entity.Power_consumption;
import entity.Rack_number;
import entity.Rack_weight;
import entity.Tempreature;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
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

@WebServlet(name = "LoadPowerUsageToArduino", urlPatterns = {"/LoadPowerUsageToArduino"})
public class LoadPowerUsageToArduino extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String fridgeCode = (String) request.getAttribute("fridgeCode");

        Gson gson = new Gson();
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();

        boolean isSuccess = false;

        Criteria fridgeCriteria = hibernateSession.createCriteria(Fridge.class);
        fridgeCriteria.add(Restrictions.eq("code", fridgeCode));
        Fridge fridge = (Fridge) fridgeCriteria.uniqueResult();

        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        double usage = 0.0;

        if (fridge != null) {

            // power consumption
            Criteria powerConsumptionCriteria = hibernateSession.createCriteria(Power_consumption.class);
            powerConsumptionCriteria.add(Restrictions.eq("fridge", fridge));
            powerConsumptionCriteria.addOrder(Order.desc("date"));
            powerConsumptionCriteria.setMaxResults(1);
            Power_consumption powerConsumption = (Power_consumption) powerConsumptionCriteria.uniqueResult();

            if (powerConsumption != null) {

                if (sdf.format(powerConsumption.getDate()).equals(sdf.format(date))) {
                    usage = powerConsumption.getPower();
                }

            }

            isSuccess = true;

        }

        hibernateSession.close();

        Response_DTO response_DTO = new Response_DTO(isSuccess, gson.toJsonTree(usage));
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));

    }
}
