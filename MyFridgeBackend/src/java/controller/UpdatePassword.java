package controller;

import com.google.gson.Gson;
import dto.Response_DTO;
import entity.Fridge;
import java.io.IOException;
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

@WebServlet(name = "UpdatePassword", urlPatterns = {"/UpdatePassword"})
public class UpdatePassword extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String fridgeCode = (String) request.getAttribute("fridgeCode");
        String oldPassword = (String) request.getAttribute("oldPassword");
        String newPassword = (String) request.getAttribute("newPassword");

        Gson gson = new Gson();
        Session hibernateSession = HibernateUtil.getSessionFactory().openSession();

        boolean isSuccess = true;
        String message = "";

        Criteria fridgeCriteria = hibernateSession.createCriteria(Fridge.class);
        fridgeCriteria.add(Restrictions.and(
                Restrictions.eq("code", fridgeCode),
                Restrictions.eq("password", oldPassword)
        ));
        Fridge fridge = (Fridge) fridgeCriteria.uniqueResult();

        if (fridge != null) {

            StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
            String encryptedPassword = passwordEncryptor.encryptPassword(newPassword);

            if (passwordEncryptor.checkPassword(newPassword, fridge.getPassword())) {
                // correct!
                isSuccess = false;
                message = "New-Password Cannot be Same As Old-Password";
            } else {
                // bad login!\
                fridge.setPassword(encryptedPassword);

                hibernateSession.update(fridge);
                hibernateSession.beginTransaction().commit();
                
                message = "Password Update Success";
            }

        } else {
            isSuccess = false;
        }

        hibernateSession.close();

        Response_DTO response_DTO = new Response_DTO(isSuccess, gson.toJsonTree(message));
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));
    }

}
