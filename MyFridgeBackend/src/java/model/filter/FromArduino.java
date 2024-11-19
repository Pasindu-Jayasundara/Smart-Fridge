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

@WebFilter(urlPatterns = {"/FromArduino"})
public class FromArduino implements Filter{

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        
        Gson gson = new Gson();
        JsonObject fromJson = gson.fromJson(request.getReader(), JsonObject.class);

        boolean isSuccess = true;
        String message = "";

        if (!fromJson.has("fridgeCode")) {

            isSuccess = false;
            message = "Missing Fridge Code";

        } else if (!fromJson.has("powerUsage")) {

            isSuccess = false;
            message = "Missing Power Usage Value";

        } else if (!fromJson.has("weight")) {

            isSuccess = false;
            message = "Missing Weight Value";

        } else if (!fromJson.has("humidity")) {

            isSuccess = false;
            message = "Missing Humidity Value";

        } else if (!fromJson.has("temperature")) {

            isSuccess = false;
            message = "Missing Tempreature Value";

        } else if (!fromJson.has("foodStatus")) {

            isSuccess = false;
            message = "Missing Food Status";

        } else if (!fromJson.has("doorStatus")) {

            isSuccess = false;
            message = "Missing Door Status";

        } else  {

            String fridgeCode = fromJson.get("fridgeCode").getAsString();
            String powerUsage = fromJson.get("powerUsage").getAsString();
            String weight = fromJson.get("weight").getAsString();
            String humidity = fromJson.get("humidity").getAsString();
            String temperature = fromJson.get("temperature").getAsString();
            String foodStatus = fromJson.get("foodStatus").getAsString();
            String doorStatus = fromJson.get("doorStatus").getAsString();
            
            if (fridgeCode.trim().equals("")) {

                isSuccess = false;
                message = "Invalid Fridge Code";

            } else if (powerUsage.trim().equals("")) {

                isSuccess = false;
                message = "Invalid Power Usage";

            } else if (weight.trim().equals("")) {

                isSuccess = false;
                message = "Invalid Fridge Code";

            } else if (humidity.trim().equals("")) {

                isSuccess = false;
                message = "Invalid Humidity";

            } else if (temperature.trim().equals("")) {

                isSuccess = false;
                message = "Invalid Tempreature";

            } else if (foodStatus.trim().equals("")) {

                isSuccess = false;
                message = "Invalid Food Status";

            } else if (doorStatus.trim().equals("")) {

                isSuccess = false;
                message = "Invalid Door Status";

            } else {
                request.setAttribute("fridgeCode", fridgeCode);
                request.setAttribute("powerUsage", powerUsage);
                request.setAttribute("weight", weight);
                request.setAttribute("humidity", humidity);
                request.setAttribute("temperature", temperature);
                request.setAttribute("foodStatus", foodStatus);
                request.setAttribute("doorStatus", doorStatus);
                
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
