package model.filter;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dto.Response_DTO;
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import model.Validation;


@WebFilter(urlPatterns = {"/Login"})
public class LoginFilter implements Filter{

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        Gson gson = new Gson();
        JsonObject fromJson = gson.fromJson(request.getReader(), JsonObject.class);

        boolean isInvalid = false;
        String errorMessage = "";

        if (!fromJson.has("fridgeCode")) {

            isInvalid = true;
            errorMessage = "Fridge Code Cannot Be Found";

        } else if (!fromJson.has("password")) {

            isInvalid = true;
            errorMessage = "Password Cannot Be Found";

        } else {

            String fridgeCode = fromJson.get("fridgeCode").getAsString();
            String password = fromJson.get("password").getAsString();

            if (fridgeCode == null || fridgeCode.trim().equals("")) {
                //no code
                isInvalid = true;
                errorMessage = "Missing Fridge Code";

            } else if (password == null || password.trim().equals("")) {
                //no password
                isInvalid = true;
                errorMessage = "Missing Password";

            } else {

                if (password.length() > 20) {
                    //password too long
                    isInvalid = true;
                    errorMessage = "Password Too Long";

                } else if (!Validation.isValidPassword(password)) {
                    //invalid password
                    isInvalid = true;
                    errorMessage = "Invalid Password Format";

                } else {

                    request.setAttribute("fridgeCode", fridgeCode);
                    request.setAttribute("password", password);

                    chain.doFilter(request, response);
                }

            }
        }

        if (isInvalid) {
            Response_DTO response_DTO = new Response_DTO(false, errorMessage);
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(response_DTO));
        }
    }


    @Override
    public void destroy() {
    }
    
}
