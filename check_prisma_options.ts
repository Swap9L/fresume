import * as ts from "typescript";

const program = ts.createProgram(["src/lib/prisma.ts"], {});
const checker = program.getTypeChecker();
const sf = program.getSourceFile("src/lib/prisma.ts");

const clientDecl = sf?.statements.find((s) => s.getText().includes("new PrismaClient"));

// we can just output the error diagnostics
const diagnostics = ts.getPreEmitDiagnostics(program);
diagnostics.forEach((d) => {
    if (d.file?.fileName.includes("prisma.ts")) {
        console.log(ts.flattenDiagnosticMessageText(d.messageText, "\n"));
    }
});

// We can extract what PrismaClientOptions expects by compiling a string
