package entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "door_status")
public class Door_status implements Serializable{
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(name = "is_door_open",nullable = false)
    private boolean is_door_open;
    
    @Column(name = "date",nullable = false)
    private Date date;
    
    @Column(name = "times",nullable = false)
    private int times;
    
    @ManyToOne
    @JoinColumn(name = "fridge_id")
    private Fridge fridge;

    public Door_status() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isIs_door_open() {
        return is_door_open;
    }

    public void setIs_door_open(boolean is_door_open) {
        this.is_door_open = is_door_open;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getTimes() {
        return times;
    }

    public void setTimes(int times) {
        this.times = times;
    }

    public Fridge getFridge() {
        return fridge;
    }

    public void setFridge(Fridge fridge) {
        this.fridge = fridge;
    }

    
}
