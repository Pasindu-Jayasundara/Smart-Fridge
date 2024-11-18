package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.Response_DTO;
import entity.Fridge;
import entity.Power_consumption;
import entity.Rack_weight;
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
import org.jasypt.util.password.StrongPasswordEncryptor;

@WebServlet(name = "Login", urlPatterns = {"/Login"})
public class Login extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String fridgeCode = (String) request.getAttribute("fridgeCode");
        String password = (String) request.getAttribute("password");

        String message = "";
        boolean isSuccess = false;

        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        JsonObject replyObj = new JsonObject();
        Gson gson = new Gson();

        // fridge
        Criteria fridgeCriteria = hibernateSession.createCriteria(Fridge.class);
        fridgeCriteria.add(Restrictions.eq("code", fridgeCode));
        Fridge fridge = (Fridge) fridgeCriteria.uniqueResult();

        if (fridge != null) {

            StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
            if (passwordEncryptor.checkPassword(password, fridge.getPassword())) {
                // correct!
                replyObj.add("fridge", gson.toJsonTree(fridge));
                message = "Login Success";
                isSuccess = true;
            } else {
                // bad login!\
                message = "Login Failed";
            }

        } else {
            message = "Invalid Details";
        }

        if (fridge != null && isSuccess) {

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
            List<Power_consumption> powerConsumptionList = powerConsumptionCriteria.list();
            if (!powerConsumptionList.isEmpty()) {

                JsonObject powerConsumptionObj = new JsonObject();
                for (Power_consumption power_consumption : powerConsumptionList) {
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

        }

        if (isSuccess) {
            jo.add("fridge", gson.toJsonTree(fridge));

            jo.addProperty("profileImage", user.getProfile_image());
            jo.addProperty("profileAbout", user.getAbout());
        } else {
            jo.addProperty("msg", message);
        }

        hibernateSession.close();

        Response_DTO response_DTO = new Response_DTO(isSuccess, gson.toJsonTree(jo));

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));

    }

}
