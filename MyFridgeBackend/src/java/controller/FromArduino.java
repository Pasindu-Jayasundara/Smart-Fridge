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

@WebServlet(name = "FromArduino", urlPatterns = {"/FromArduino"})
public class FromArduino extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String fridgeCode = (String) request.getAttribute("fridgeCode");
        String powerUsage = (String) request.getAttribute("powerUsage");
        String weight = (String) request.getAttribute("weight");
        String humidity = (String) request.getAttribute("humidity");
        String temperature = (String) request.getAttribute("temperature");
        String foodStatus = (String) request.getAttribute("foodStatus");
        String doorStatus = (String) request.getAttribute("doorStatus");

        Gson gson = new Gson();
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();

        boolean isSuccess = false;

        Criteria fridgeCriteria = hibernateSession.createCriteria(Fridge.class);
        fridgeCriteria.add(Restrictions.eq("code", fridgeCode));
        Fridge fridge = (Fridge) fridgeCriteria.uniqueResult();

        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        if (fridge != null) {

            // weight
            Rack_number rack1 = (Rack_number) hibernateSession.get(Rack_number.class, 1);

            Criteria rackWeightCriteria = hibernateSession.createCriteria(Rack_weight.class);
            rackWeightCriteria.add(Restrictions.and(
                    Restrictions.eq("fridge", fridge),
                    Restrictions.eq("rack_number", rack1)
            ));
            Rack_weight rw = (Rack_weight) rackWeightCriteria.uniqueResult();
            rw.setWeight(Double.parseDouble(weight));

            hibernateSession.update(rw);

            // temperature
            Criteria temperatureCriteria = hibernateSession.createCriteria(Tempreature.class);
            temperatureCriteria.add(Restrictions.eq("fridge", fridge));
            Tempreature tem = (Tempreature) temperatureCriteria.uniqueResult();

            tem.setTemp(Double.parseDouble(temperature));
            hibernateSession.update(tem);

            // food status
            Criteria foodStatusCriteria = hibernateSession.createCriteria(Food_status.class);
            foodStatusCriteria.add(Restrictions.eq("fridge", fridge));
            Food_status fs = (Food_status) foodStatusCriteria.uniqueResult();

            fs.setFood_status(Integer.parseInt(foodStatus));
            hibernateSession.update(fs);

            // power consumption
            Criteria powerConsumptionCriteria = hibernateSession.createCriteria(Power_consumption.class);
            powerConsumptionCriteria.add(Restrictions.eq("fridge", fridge));
            powerConsumptionCriteria.addOrder(Order.desc("date"));
            powerConsumptionCriteria.setMaxResults(1);
            Power_consumption pc = (Power_consumption) powerConsumptionCriteria.uniqueResult();

            if (pc != null) {

                if (sdf.format(date).equals(sdf.format(pc.getDate()))) {
                    pc.setPower(Double.parseDouble(powerUsage));
                    hibernateSession.update(pc);
                } else {
                    Power_consumption newPc = new Power_consumption();
                    newPc.setDate(date);
                    newPc.setFridge(fridge);
                    newPc.setPower(Double.parseDouble(powerUsage));

                    hibernateSession.save(newPc);
                }

            } else {

                Power_consumption newPc = new Power_consumption();
                newPc.setDate(date);
                newPc.setFridge(fridge);
                newPc.setPower(Double.parseDouble(powerUsage));

                hibernateSession.save(newPc);

            }

            // door status
            Criteria doorStatusCriteria = hibernateSession.createCriteria(Door_status.class);
            doorStatusCriteria.add(Restrictions.eq("fridge", fridge));
            doorStatusCriteria.addOrder(Order.desc("date"));
            doorStatusCriteria.setMaxResults(1);
            Door_status ds = (Door_status) doorStatusCriteria.uniqueResult();

            if (ds != null) {

                if (sdf.format(date).equals(sdf.format(ds.getDate()))) {
                    if (doorStatus.equals("1") && !ds.isIs_door_open()) {
                        ds.setTimes(ds.getTimes() + 1);
                    }
                    ds.setIs_door_open(doorStatus.equals("1"));

                    hibernateSession.update(ds);
                } else {
                    Door_status newDs = new Door_status();
                    newDs.setDate(date);
                    newDs.setFridge(fridge);
                    newDs.setIs_door_open(doorStatus.equals("1"));
                    newDs.setTimes(1);

                    hibernateSession.save(newDs);
                }

            } else {

                Door_status newDs = new Door_status();
                newDs.setDate(date);
                newDs.setFridge(fridge);
                newDs.setIs_door_open(doorStatus.equals("1"));
                newDs.setTimes(1);

                hibernateSession.save(newDs);

            }

            // humidity
            Criteria humidityCriteria = hibernateSession.createCriteria(Humidity.class);
            humidityCriteria.add(Restrictions.eq("fridge", fridge));
            Humidity hu = (Humidity) humidityCriteria.uniqueResult();

            if (hu != null) {
                hu.setHumidity(Double.parseDouble(humidity));
                hibernateSession.update(hu);
            } else {
                Humidity newHu = new Humidity();
                newHu.setFridge(fridge);
                newHu.setHumidity(Double.parseDouble(humidity));

                hibernateSession.save(newHu);
            }

            hibernateSession.beginTransaction().commit();
            isSuccess = true;
        }

        hibernateSession.close();

        Response_DTO response_DTO = new Response_DTO(isSuccess, gson.toJsonTree(fridge.isIsOn()));
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));

    }

}
