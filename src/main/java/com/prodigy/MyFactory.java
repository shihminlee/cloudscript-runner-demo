package com.prodigy;

import org.mozilla.javascript.*;

 class MyFactory extends ContextFactory
 {

     // Custom Context to store execution time.
     private static class MyContext extends Context
     {
         long startTime;
     }

     static {
         // Initialize GlobalFactory with custom factory
         ContextFactory.initGlobal(new MyFactory());
     }

     // Override makeContext()
     protected Context makeContext()
     {
         MyContext cx = new MyContext();
         // Make Rhino runtime to call observeInstructionCount
         // each 10000 bytecode instructions
         cx.setInstructionObserverThreshold(1000);
         return cx;
     }

     // Override hasFeature(Context, int)
     public boolean hasFeature(Context cx, int featureIndex)
     {
         // Turn on maximum compatibility with MSIE scripts
         switch (featureIndex) {
             case Context.FEATURE_NON_ECMA_GET_YEAR:
                 return true;

             case Context.FEATURE_MEMBER_EXPR_AS_FUNCTION_NAME:
                 return true;

             case Context.FEATURE_RESERVED_KEYWORD_AS_IDENTIFIER:
                 return true;

             case Context.FEATURE_PARENT_PROTO_PROPERTIES:
                 return false;
         }
         return super.hasFeature(cx, featureIndex);
     }

     // Override observeInstructionCount(Context, int)
     protected void observeInstructionCount(Context cx, int instructionCount)
     {
         MyContext mcx = (MyContext)cx;
         long currentTime = System.currentTimeMillis();
         if (currentTime - mcx.startTime > 1 * 1000) {
             // More then 10 seconds from Context creation time:
             // it is time to stop the script.
             // Throw Error instance to ensure that script will never
             // get control back through catch or finally.
             throw new Error();
         }
     }

     // Override doTopCall(Callable,
                               // Context, Scriptable,
                               // Scriptable, Object[])
     protected Object doTopCall(Callable callable,
                                Context cx, Scriptable scope,
                                Scriptable thisObj, Object[] args)
     {
         MyContext mcx = (MyContext)cx;
         mcx.startTime = System.currentTimeMillis();

         return super.doTopCall(callable, cx, scope, thisObj, args);
     }

 }
