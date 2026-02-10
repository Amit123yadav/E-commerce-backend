export const testController = (req,res) => {
res.status(200).send({
    messsage: "Test route is working",
    status: true
})
}