makePayment() {
    // verify 
    // 1) invoices belong to company
    // 2) ammount to be applied <= due

    from authorization
    from check, cc, cash ??

    in a transaction {
    create payment record
    create linkrecords where 
    update invoice.due
    }
}