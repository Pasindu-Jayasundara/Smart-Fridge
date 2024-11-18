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

@WebFilter(urlPatterns = {"/UpdatePassword"})
public class UpdatePassword implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        Gson gson = new Gson();
        JsonObject fromJson = gson.fromJson(request.getReader(), JsonObject.class);

        boolean isSuccess = false;
        String message = "";

        if (!fromJson.has("fridgeCode")) {
            message = "Missing Fridge Code";
        } else if (!fromJson.has("newPassword")) {
            message = "Missing New Password";
        } else if (!fromJson.has("oldPassword")) {
            message = "Missing Old Password";
        } else {

            String fridgeCode = fromJson.get("fridgeCode").getAsString();
            String oldPassword = fromJson.get("oldPassword").getAsString();
            String newPassword = fromJson.get("newPassword").getAsString();

            if (fridgeCode.trim().equals("")) {
                message = "Empty Fridge Code";
            } else if (oldPassword.trim().equals("")) {
                message = "Empty Old Password";
            } else if (newPassword.trim().equals("")) {
                message = "Empty New Password";
            } else {

                isSuccess = true;

                request.setAttribute("fridgeCode", fridgeCode);
                request.setAttribute("oldPassword", oldPassword);
                request.setAttribute("newPassword", newPassword);

                chain.doFilter(request, response);
            }
        }

        if (!isSuccess) {
            Response_DTO response_DTO = new Response_DTO(isSuccess, message);
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(response_DTO));
        }

    }

    @Override
    public void destroy() {
    }

}
