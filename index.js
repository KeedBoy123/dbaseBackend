const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

app.post("/addemp", async (req,res) =>{
    try {
        const{firstname, lastname, contactnum, emailadd, birthday, salary, department} = req.body

        const sql =`INSERT INTO public."Employee"(
            firstname, lastname, contactnum, emailadd, birthday, salary, department)
            VALUES ($1, $2, $3, $4, $5, $6, $7) returning*`
            const rs = await pool.query(sql,[firstname, lastname, contactnum, emailadd, birthday, salary, department])
    
            res.json(rs.rows)
    } catch (error) {
        console.log(error.message);
    }
    })

    app.post("/adddept", async (req,res) =>{
        try {
            const{deptname} = req.body
    
            const sql =`INSERT INTO public."Department"(
                deptname)
                VALUES ($1) returning*`
                const rs = await pool.query(sql,[deptname])
        
                res.json(rs.rows)
        } catch (error) {
            res.json(error.message);
        }
        })

    app.post("/addbonus", async (req,res) =>{
         try {
                const{value,month,dept} = req.body
        
                const sql =`INSERT INTO public."Bonus"(
                    value, month, dept)
                    VALUES ($1, $2, $3) returning*`
                    const rs = await pool.query(sql,[value,month,dept])
            
                    res.json(rs.rows)
            } catch (error) {
                res.json(error.message);
            }
            })
    
    app.get("/getemp", async (req,res) =>{
         try {
                const sql =`SELECT id, firstname, lastname, emailadd, birthday, salary, department, contactnum
                FROM public."Employee"`
                    const rs = await pool.query(sql)
            
                    res.json(rs.rows)
            } catch (error) {
                res.json(error.message);
            }
            })

    app.get("/getdept", async (req,res) =>{
         try {
                const sql =`SELECT deptid, deptname
                FROM public."Department"`
                    const rs = await pool.query(sql)
            
                    res.json(rs.rows)
            } catch (error) {
                res.json(error.message);
            }
            })

    app.get("/getbonus", async (req,res) =>{
         try {
                const sql =`SELECT bonusid, value, month, dept
                FROM public."Bonus"`
                    const rs = await pool.query(sql)
            
                    res.json(rs.rows)
            } catch (error) {
                res.json(error.message);
            }
            })

    app.put("/editemp/:id", async (req,res) =>{
        try {
            const{firstname, lastname, contactnum, emailadd, birthday, salary, department} = req.body
    
            const sql =`UPDATE public."Employee"
            SET firstname=$2, lastname=$3, emailadd=$4, birthday=$5, salary=$6, department=$7, contactnum=$8
            WHERE id= $1`
                const rs = await pool.query(sql,[req.params.id,firstname, lastname, contactnum, emailadd, birthday, salary, department])
        
                res.json(rs.rows)
        } catch (error) {
            res.json(error.message);
        }
        })

    app.put("/editdept/:id", async (req,res) =>{
            try {
                const{deptname} = req.body
        
                const sql =`UPDATE public."Department"
                SET deptname=$2
                WHERE id=$1`
                    const rs = await pool.query(sql,[req.params.id,deptname])
            
                    res.json(rs.rows)
            } catch (error) {
                res.json(error.message);
            }
            })

    app.get("/report/:dep/:month", async (req,res) =>{
        try {
               const sql =`SELECT id, firstname, lastname, emailadd, birthday, salary, dept.deptname, contactnum, (salary+(salary*bon.value)) AS salary_bonus
               FROM public."Employee" emp
               LEFT OUTER JOIN  "Department" dept ON dept.deptid = emp.department
               LEFT OUTER JOIN "Bonus" bon ON bon.dept = dept.deptid
               WHERE emp.department = $1 AND bon.month = $2
               `
                   const rs = await pool.query(sql,[req.params.dep, req.params.month])
           
                   res.json(rs.rows)
           } catch (error) {
               res.json(error.message);
           }
           })








const PORT = process.env.PORT||5000;
app.listen(PORT,() =>{
    console.log(`Serverat:port${PORT}`)
})

