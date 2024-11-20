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

@WebFilter(urlPatterns = {"/LoadDoorHistory", "/LoadPowerConsumptionHistory", "/LoadProfile", "/UpdateFridgeStatus","/LoadPowerUsageToArduino"})
public class LoadDetails implements Filter {

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

        } else {

            String fridgeCode = fromJson.get("fridgeCode").getAsString();
            if (fridgeCode.trim().equals("")) {

                isSuccess = false;
                message = "Invalid Fridge Code";

            } else {
                request.setAttribute("fridgeCode", fridgeCode);
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
