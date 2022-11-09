import ast

class ModuleImporter(ast.NodeTransformer):

    def visit_Module(self, node: ast.Module) -> ast.Module:

        # from inspect import getframeinfo, currentframe
        import_inspect = ast.ImportFrom(
            module='inspect',
            names=[
                ast.alias(name='getframeinfo', asname=None),
                ast.alias(name='currentframe', asname=None)
            ],
            level=0
        )
        node.body.insert(0, import_inspect)

        return ast.fix_missing_locations(node)

class FunctionInserter(ast.NodeTransformer):

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

        # getframeinfo(currentframe().f_back)
        call_getframeinfo = ast.Call(
            func=ast.Name(id='getframeinfo', ctx=ast.Load()),
            args=[
                ast.Attribute(
                    value=call_currentframe,
                    attr='f_back',
                    ctx=ast.Load()
                )
            ],
            keywords=[]
        )

        # func_call_info(func, locals(), getframeinfo(currentframe().f_back))
        call_func_call_info = ast.Expr(
            value=ast.Call(
                func=ast.Name(id='func_call_info', ctx=ast.Load()), 
                args=[
                    ast.Name(id=node.name, ctx=ast.Load()),
                    call_locals,
                    call_getframeinfo
                ], 
                keywords=[]
            )
        )

        node.body.insert(0, call_func_call_info)
        return ast.fix_missing_locations(node)