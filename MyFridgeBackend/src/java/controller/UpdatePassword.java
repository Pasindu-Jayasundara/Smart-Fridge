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
        fridgeCriteria.add(Restrictions.eq("code", fridgeCode));
        Fridge fridge = (Fridge) fridgeCriteria.uniqueResult();

        if (fridge != null) {
            StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();
            if (passwordEncryptor.checkPassword(oldPassword, fridge.getPassword())) {
                // correct!

                if (passwordEncryptor.checkPassword(newPassword, fridge.getPassword())) {
                    // correct!
                    isSuccess = false;
                    message = "New-Password Cannot be Same As Old-Password";
                } else {
                    // bad login!\
                    String encryptPassword = passwordEncryptor.encryptPassword(newPassword);
                    fridge.setPassword(encryptPassword);

                    hibernateSession.update(fridge);
                    hibernateSession.beginTransaction().commit();

                    message = "Password Update Success";
                }
            } else {
                // bad login!\
                isSuccess = false;
                message = "Invalid Credentials";
            }

        } else {
            isSuccess = false;
            message = "Invalid Details";
        }

        hibernateSession.close();

        Response_DTO response_DTO = new Response_DTO(isSuccess, gson.toJsonTree(message));
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(response_DTO));
    }

}
