package dto;

import java.io.Serializable;

public class Response_DTO implements Serializable{
    
    private boolean isSuccess;
    private Object data;

    public Response_DTO() {
    }

    public Response_DTO(boolean success, Object data) {
        this.isSuccess = success;
        this.data = data;
    }
    
    public boolean isIsSuccess() {
        return isSuccess;
    }

    public void setIsSuccess(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
