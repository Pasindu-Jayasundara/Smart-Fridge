package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.Response_DTO;
import entity.Fridge;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "UpdateFridgeStatus", urlPatterns = {"/UpdateFridgeStatus"})
public class UpdateFridgeStatus extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String fridgeCode = (String) request.getAttribute("fridgeCode");

        Gson gson = new Gson();
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
        JsonObject replyObj = new JsonObject();

        boolean isSuccess = true;

        Criteria fridgeCriteria = hibernateSession.createCriteria(Fridge.class);
        fridgeCriteria.add(Restrictions.eq("code", String.valueOf(fridgeCode)));
        Fridge fridge = (Fridge) fridgeCriteria.uniqueResult();

        if (fridge != null) {

            fridge.setIsOn(!fridge.isIsOn());
            hibernateSession.update(fridge);

            hibernateSession.beginTransaction().commit();

        } else {
            isSuccess = false;
        }
        hibernateSession.close();

        Response_DTO response_DTO = new Response_DTO(isSuccess, gson.toJsonTree(replyObj));
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));
    }

}
