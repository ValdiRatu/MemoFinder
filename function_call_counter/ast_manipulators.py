import ast

class ModuleImporter(ast.NodeTransformer):

    def visit_Module(self, node: ast.Module) -> ast.Module:
        # from inspect import currentframe
        import_inspect = ast.ImportFrom(
            module='inspect',
            names=[
                ast.alias(name='currentframe', asname=None)
            ],
            level=0
        )
        node.body.insert(0, import_inspect)

        return ast.fix_missing_locations(node)

class FunctionInserter(ast.NodeTransformer):
    # inserts a call to get_func_call_info at the start of function definitions
    def visit_FunctionDef(self, node: ast.FunctionDef) -> ast.FunctionDef:
        # locals()
        call_locals = ast.Call(
            func=ast.Name(id='locals', ctx=ast.Load()),
            args=[],
            keywords=[]
        )

        # currentframe()
        call_currentframe = ast.Call(
            func=ast.Name(id='currentframe', ctx=ast.Load()),
            args=[],
            keywords=[]
        )

        # func_call_info(func, locals(), currentframe().f_back)
        call_func_call_info = ast.Expr(
            value=ast.Call(
                func=ast.Name(id='get_func_call_info', ctx=ast.Load()), 
                args=[
                    ast.Name(id=node.name, ctx=ast.Load()),
                    call_locals,
                    ast.Attribute(
                        value=call_currentframe,
                        attr='f_back',
                        ctx=ast.Load()
                    )
                ], 
                keywords=[]
            )
        )

        node.body.insert(0, call_func_call_info)
        return ast.fix_missing_locations(node)