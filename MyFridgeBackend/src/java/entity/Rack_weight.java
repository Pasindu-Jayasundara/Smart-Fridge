package entity;

import java.io.Serializable;
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
@Table(name = "rack_weight")
public class Rack_weight implements Serializable{
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(name = "weight",nullable = false)
    private double weight;
    
    @ManyToOne
    @JoinColumn(name = "rack_number_id")
    private Rack_number rack_number;
    
    @ManyToOne
    @JoinColumn(name = "fridge_id")
    private Fridge fridge;

    public Rack_weight() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public Rack_number getRack_number() {
        return rack_number;
    }

    public void setRack_number(Rack_number rack_number) {
        this.rack_number = rack_number;
    }

    public Fridge getFridge() {
        return fridge;
    }

    public void setFridge(Fridge fridge) {
        this.fridge = fridge;
    }
    
    
    
}
