package entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rack_number")
public class Rack_number implements Serializable{
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(name = "rack_number",nullable = false)
    private int rack_number;

    public Rack_number() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getRack_number() {
        return rack_number;
    }

    public void setRack_number(int rack_number) {
        this.rack_number = rack_number;
    }
    
    
    
}
