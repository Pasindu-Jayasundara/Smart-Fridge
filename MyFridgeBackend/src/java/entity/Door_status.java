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
    
    @Column(name = "from",nullable = false)
    private Date from;
    
    @Column(name = "to",nullable = false)
    private Date to;
    
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

    public Date getFrom() {
        return from;
    }

    public void setFrom(Date from) {
        this.from = from;
    }

    public Date getTo() {
        return to;
    }

    public void setTo(Date to) {
        this.to = to;
    }

    public Fridge getFridge() {
        return fridge;
    }

    public void setFridge(Fridge fridge) {
        this.fridge = fridge;
    }
    
    
    
}
